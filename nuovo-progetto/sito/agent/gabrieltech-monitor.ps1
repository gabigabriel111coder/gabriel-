#Requires -Version 5.1
<#
  Gabriel Tech - monitoraggio del PC (sola lettura)

  Una volta al giorno (e 10 minuti dopo l'accensione) controlla lo stato del
  computer e lo invia al pannello del tecnico: spazio e salute dei dischi,
  antivirus, firewall, aggiornamenti di Windows, riavvii in sospeso e backup.
  NON legge file personali, email o foto e NON permette di controllare il PC:
  per collegarsi serve sempre AnyDesk con il permesso del cliente.

  Uso (in PowerShell aperto come amministratore):
    Installa:   .\gabrieltech-monitor.ps1 -Install -Endpoint <indirizzo> -DeviceId <codice> -Token <chiave> [-BackupPath <cartella>]
    Anteprima:  .\gabrieltech-monitor.ps1 -Preview      (mostra cosa verrebbe inviato, senza inviare nulla)
    Rimuovi:    .\gabrieltech-monitor.ps1 -Uninstall
#>
[CmdletBinding(DefaultParameterSetName = "Run")]
param(
  [Parameter(ParameterSetName = "Install", Mandatory = $true)][switch]$Install,
  [Parameter(ParameterSetName = "Install", Mandatory = $true)][string]$Endpoint,
  [Parameter(ParameterSetName = "Install", Mandatory = $true)][string]$DeviceId,
  [Parameter(ParameterSetName = "Install", Mandatory = $true)][string]$Token,
  [Parameter(ParameterSetName = "Install")][Parameter(ParameterSetName = "Preview")][string]$BackupPath = "",
  [Parameter(ParameterSetName = "Uninstall", Mandatory = $true)][switch]$Uninstall,
  [Parameter(ParameterSetName = "Preview", Mandatory = $true)][switch]$Preview
)

$ErrorActionPreference = "Stop"
$Versione = 1
$Cartella = Join-Path $env:ProgramData "GabrielTech"
$Script = Join-Path $Cartella "monitor.ps1"
$Config = Join-Path $Cartella "config.json"
$Stato = Join-Path $Cartella "stato.json"
$Log = Join-Path $Cartella "monitor.log"
$NomeAttivita = "Gabriel Tech - Monitoraggio"

function Write-GtLog([string]$Testo) {
  try {
    if ((Test-Path -LiteralPath $Log) -and (Get-Item -LiteralPath $Log).Length -gt 100KB) {
      $ultime = Get-Content -LiteralPath $Log -Tail 200
      Set-Content -LiteralPath $Log -Value $ultime -Encoding UTF8
    }
    Add-Content -LiteralPath $Log -Value ("{0:yyyy-MM-dd HH:mm:ss}  {1}" -f (Get-Date), $Testo) -Encoding UTF8
  } catch { }
}

function Get-Days($Data) {
  if (-not $Data) { return $null }
  return [math]::Round(((Get-Date) - [datetime]$Data).TotalDays, 1)
}

function Test-Admin {
  $io = [Security.Principal.WindowsIdentity]::GetCurrent()
  return (New-Object Security.Principal.WindowsPrincipal($io)).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Stato di un prodotto di sicurezza registrato in Windows: acceso e aggiornato
function Get-ProductState($Valore) {
  $hex = "{0:X6}" -f [int]$Valore
  $hex = $hex.Substring($hex.Length - 6)
  return @{ attivo = (@("10", "11") -contains $hex.Substring(2, 2)); aggiornato = ($hex.Substring(4, 2) -eq "00") }
}

function Get-LastUpdateDays {
  # Esclude gli aggiornamenti giornalieri dell'antivirus: contano solo quelli di Windows
  $esclusi = "KB2267602|KB4052623|KB2461484|KB915597|KB5007651|KB4023057|Defender|Security Intelligence"
  try {
    $cerca = (New-Object -ComObject Microsoft.Update.Session).CreateUpdateSearcher()
    $totale = $cerca.GetTotalHistoryCount()
    if ($totale -gt 0) {
      $ultima = $null
      foreach ($voce in $cerca.QueryHistory(0, [math]::Min($totale, 300))) {
        if ($voce.Operation -eq 1 -and ($voce.ResultCode -eq 2 -or $voce.ResultCode -eq 3) -and $voce.Title -notmatch $esclusi) {
          if (-not $ultima -or $voce.Date -gt $ultima) { $ultima = $voce.Date }
        }
      }
      if ($ultima) { return [math]::Round(((Get-Date).ToUniversalTime() - $ultima).TotalDays, 1) }
    }
  } catch { }
  try {
    $hf = Get-HotFix -ErrorAction Stop | Where-Object { $_.InstalledOn } | Sort-Object InstalledOn -Descending | Select-Object -First 1
    if ($hf) { return Get-Days $hf.InstalledOn }
  } catch { }
  return $null
}

function Get-Backup([string]$Percorso) {
  if (-not $Percorso) { return $null }
  $b = [ordered]@{ tipo = "Cartella"; percorso = $Percorso; trovato = $false; ultimoGiorni = $null }
  $salvato = $null
  try { if (Test-Path -LiteralPath $Stato) { $salvato = (Get-Content -LiteralPath $Stato -Raw | ConvertFrom-Json).ultimoBackup } } catch { }
  if (Test-Path -LiteralPath $Percorso) {
    $b.trovato = $true
    $recente = Get-ChildItem -LiteralPath $Percorso -Recurse -Depth 3 -Force -ErrorAction SilentlyContinue |
      Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($recente) {
      $salvato = $recente.LastWriteTime.ToString("o")
      try { if (Test-Path -LiteralPath $Cartella) { @{ ultimoBackup = $salvato } | ConvertTo-Json | Set-Content -LiteralPath $Stato -Encoding UTF8 } } catch { }
    }
  }
  # Disco del backup scollegato: vale l'ultima data vista
  if ($salvato) { $b.ultimoGiorni = Get-Days ([datetime]::Parse($salvato)) }
  return $b
}

function Get-GtReport([string]$Backup) {
  $os = Get-CimInstance Win32_OperatingSystem
  $cs = Get-CimInstance Win32_ComputerSystem

  # Dischi interni (i dischi USB, per esempio quello del backup, restano fuori)
  $usb = @()
  try {
    $usb = @(Get-Disk -ErrorAction Stop | Where-Object { [string]$_.BusType -eq "USB" } |
      Get-Partition -ErrorAction SilentlyContinue | Where-Object { $_.DriveLetter } | ForEach-Object { "$($_.DriveLetter):" })
  } catch { }
  $dischi = @(Get-CimInstance Win32_LogicalDisk -Filter "DriveType=3" | Where-Object { $_.Size -gt 0 -and $usb -notcontains $_.DeviceID } | ForEach-Object {
      [ordered]@{ unita = $_.DeviceID; totaleGB = [math]::Round($_.Size / 1GB, 1); liberoGB = [math]::Round($_.FreeSpace / 1GB, 1) }
    })
  $salute = @()
  try {
    $salute = @(Get-PhysicalDisk -ErrorAction Stop | ForEach-Object { [ordered]@{ nome = [string]$_.FriendlyName; stato = [string]$_.HealthStatus } })
  } catch { }

  $antivirus = $null
  try {
    $antivirus = @(Get-CimInstance -Namespace "root/SecurityCenter2" -ClassName AntiVirusProduct -ErrorAction Stop | ForEach-Object {
        $s = Get-ProductState $_.productState
        [ordered]@{ nome = [string]$_.displayName; attivo = $s.attivo; aggiornato = $s.aggiornato }
      })
  } catch { }

  $defender = $null
  try {
    $mp = Get-MpComputerStatus -ErrorAction Stop
    $normale = ([string]$mp.AMRunningMode -eq "Normal") -or (-not $mp.AMRunningMode -and $mp.AntivirusEnabled)
    $defender = [ordered]@{ attivo = [bool]$normale; tempoReale = [bool]$mp.RealTimeProtectionEnabled; firmeGiorni = (Get-Days $mp.AntivirusSignatureLastUpdated) }
  } catch { }

  $firewall = $null
  try {
    $profili = @(Get-NetFirewallProfile -PolicyStore ActiveStore -ErrorAction Stop)
    # Contano i profili delle reti in uso (casa, lavoro, pubblica)
    $inUso = @()
    try {
      $inUso = @(Get-NetConnectionProfile -ErrorAction Stop | ForEach-Object { if ([string]$_.NetworkCategory -eq "DomainAuthenticated") { "Domain" } else { [string]$_.NetworkCategory } })
    } catch { }
    if ($inUso.Count) { $profili = @($profili | Where-Object { $inUso -contains [string]$_.Name }) }
    $spenti = @($profili | Where-Object { [string]$_.Enabled -ne "True" })
    $altri = @()
    try {
      $altri = @(Get-CimInstance -Namespace "root/SecurityCenter2" -ClassName FirewallProduct -ErrorAction Stop | Where-Object { (Get-ProductState $_.productState).attivo })
    } catch { }
    $firewall = [ordered]@{ attivo = ($spenti.Count -eq 0 -or $altri.Count -gt 0) }
  } catch { }

  $riavvio = (Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending") -or
    (Test-Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired")

  return [ordered]@{
    versione = $Versione
    sistema = [ordered]@{ nome = [string]$os.Caption; versione = [string]$os.Version; build = [string]$os.BuildNumber; architettura = [string]$os.OSArchitecture }
    computer = [ordered]@{ nome = $env:COMPUTERNAME; produttore = [string]$cs.Manufacturer; modello = [string]$cs.Model }
    avvioGiorni = (Get-Days $os.LastBootUpTime)
    dischi = $dischi
    saluteDischi = $salute
    antivirus = $antivirus
    defender = $defender
    firewall = $firewall
    aggiornamenti = [ordered]@{ ultimoGiorni = (Get-LastUpdateDays); riavvioInSospeso = [bool]$riavvio }
    backup = (Get-Backup $Backup)
  }
}

function Send-GtReport($Cfg) {
  [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
  $report = Get-GtReport ([string]$Cfg.backup)
  $report["dispositivo"] = [string]$Cfg.id
  $corpo = [Text.Encoding]::UTF8.GetBytes(($report | ConvertTo-Json -Depth 6 -Compress))
  try {
    $risposta = Invoke-WebRequest -Uri $Cfg.endpoint -Method Post -Body $corpo -ContentType "application/json; charset=utf-8" `
      -Headers @{ Authorization = "Bearer $($Cfg.token)" } -UseBasicParsing -TimeoutSec 60
    Write-GtLog "Controllo inviato"
    return [int]$risposta.StatusCode
  } catch {
    $codice = 0
    if ($_.Exception.Response) { $codice = [int]$_.Exception.Response.StatusCode }
    Write-GtLog "Invio non riuscito ($codice): $($_.Exception.Message)"
    return $codice
  }
}

function Uninstall-Gt([switch]$Silenzioso) {
  Unregister-ScheduledTask -TaskName $NomeAttivita -Confirm:$false -ErrorAction SilentlyContinue
  Remove-Item -LiteralPath $Cartella -Recurse -Force -ErrorAction SilentlyContinue
  if (-not $Silenzioso) { Write-Host "Monitoraggio di Gabriel Tech rimosso da questo PC." -ForegroundColor Green }
}

function Invoke-GtRun {
  if (-not (Test-Path -LiteralPath $Config)) {
    Write-Host "Il monitoraggio non è installato su questo PC."
    return 0
  }
  $cfg = Get-Content -LiteralPath $Config -Raw | ConvertFrom-Json
  $codice = Send-GtReport $cfg
  if ($codice -eq 410) {
    Write-GtLog "Il tecnico ha rimosso il monitoraggio: disinstallo."
    Uninstall-Gt -Silenzioso
  }
  return $codice
}

function Install-Gt {
  if (-not (Test-Admin)) { throw "Apri PowerShell come amministratore (tasto destro su Start) e riprova." }
  if ($Endpoint -notmatch "^https://") { throw "L'indirizzo deve iniziare con https://" }
  if ($DeviceId -notmatch "^[0-9a-z]{17}$") { throw "Codice del PC non valido: copia di nuovo il comando dal pannello." }

  New-Item -ItemType Directory -Path $Cartella -Force | Out-Null
  # Cartella leggibile solo da Windows (SYSTEM) e dagli amministratori: la chiave resta protetta
  & icacls.exe $Cartella /inheritance:r /grant:r "*S-1-5-18:(OI)(CI)F" "*S-1-5-32-544:(OI)(CI)F" | Out-Null
  if ($PSCommandPath -and ([IO.Path]::GetFullPath($PSCommandPath) -ne [IO.Path]::GetFullPath($Script))) {
    Copy-Item -LiteralPath $PSCommandPath -Destination $Script -Force
  }
  Unblock-File -LiteralPath $Script -ErrorAction SilentlyContinue
  [ordered]@{ endpoint = $Endpoint; id = $DeviceId; token = $Token; backup = $BackupPath } | ConvertTo-Json | Set-Content -LiteralPath $Config -Encoding UTF8

  $azione = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -NonInteractive -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$Script`""
  $ogniGiorno = New-ScheduledTaskTrigger -Daily -At "10:00" -RandomDelay (New-TimeSpan -Minutes 30)
  $accensione = New-ScheduledTaskTrigger -AtStartup
  $accensione.Delay = "PT10M"
  $utente = New-ScheduledTaskPrincipal -UserId "SYSTEM" -LogonType ServiceAccount -RunLevel Highest
  $regole = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 15) -MultipleInstances IgnoreNew
  Register-ScheduledTask -TaskName $NomeAttivita -Action $azione -Trigger @($ogniGiorno, $accensione) -Principal $utente -Settings $regole `
    -Description "Gabriel Tech: controllo giornaliero dello stato del PC, in sola lettura." -Force | Out-Null

  Write-Host "Installato. Invio il primo controllo..."
  $codice = Invoke-GtRun
  if ($codice -eq 200) {
    Write-Host "Fatto! Il PC compare nel pannello di Gabriel Tech." -ForegroundColor Green
  } else {
    Write-Host "Installato, ma il primo invio non è riuscito (codice $codice). Riprovo da solo ogni giorno; il registro è in $Log" -ForegroundColor Yellow
  }
}

switch ($PSCmdlet.ParameterSetName) {
  "Install" { Install-Gt }
  "Uninstall" {
    if (-not (Test-Admin)) { throw "Apri PowerShell come amministratore e riprova." }
    Uninstall-Gt
  }
  "Preview" { Get-GtReport $BackupPath | ConvertTo-Json -Depth 6 }
  default { [void](Invoke-GtRun) }
}
