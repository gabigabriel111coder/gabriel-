#!/bin/bash
# ==========================================================================
#  Gabriel Tech - monitoraggio del Mac (sola lettura)
#
#  Una volta al giorno (e all'accensione) controlla lo stato del Mac e lo invia
#  al pannello del tecnico: spazio sul disco, firewall, FileVault, Gatekeeper,
#  protezione di sistema (SIP) e backup di Time Machine.
#  NON legge file personali, email o foto e NON permette di controllare il Mac.
#
#  Uso (nel Terminale):
#    Installa:   sudo bash gabrieltech-monitor.sh install <indirizzo> <codice> <chiave> [cartella-backup]
#    Anteprima:  bash gabrieltech-monitor.sh preview     (mostra cosa verrebbe inviato)
#    Rimuovi:    sudo bash gabrieltech-monitor.sh uninstall
# ==========================================================================
set -u

VERSIONE=1
CARTELLA="/Library/Application Support/GabrielTech"
SCRIPT="$CARTELLA/monitor.sh"
CONFIG="$CARTELLA/config"
STATO="$CARTELLA/stato"
LOG="$CARTELLA/monitor.log"
ETICHETTA="it.gabrieltech.monitor"
PLIST="/Library/LaunchDaemons/$ETICHETTA.plist"

log() {
  [ -d "$CARTELLA" ] || return 0
  if [ -f "$LOG" ] && [ "$(wc -c < "$LOG")" -gt 100000 ]; then
    tail -n 200 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
  fi
  printf '%s  %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$1" >> "$LOG"
}

# Testo sicuro dentro il JSON
js() {
  printf '"%s"' "$(printf '%s' "$1" | tr -d '\000-\037' | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g')"
}
# Numero (o null se vuoto)
jn() {
  case "$1" in
    ''|*[!0-9.]*) printf 'null' ;;
    *) printf '%s' "$1" ;;
  esac
}
giorni_da() { # secondi dall'epoca → giorni fa, con un decimale
  [ -n "$1" ] || { printf ''; return; }
  awk -v t="$1" -v n="$(date +%s)" 'BEGIN { d = (n - t) / 86400; if (d < 0) d = 0; printf "%.1f", d }'
}
leggi() { # valore di una voce della configurazione
  [ -f "$CONFIG" ] && sed -n "s/^$1=//p" "$CONFIG" | head -n 1
}

report() {
  local backup_path="${1:-}"
  local nome versione build modello computer avvio ora
  nome="$(sw_vers -productName 2>/dev/null || echo macOS)"
  versione="$(sw_vers -productVersion 2>/dev/null)"
  build="$(sw_vers -buildVersion 2>/dev/null)"
  modello="$(sysctl -n hw.model 2>/dev/null)"
  computer="$(scutil --get ComputerName 2>/dev/null || hostname)"
  avvio="$(sysctl -n kern.boottime 2>/dev/null | sed -n 's/.*sec = \([0-9]*\).*/\1/p')"

  # Disco: spazio del volume dei dati (su APFS è condiviso con quello di sistema)
  local volume="/System/Volumes/Data" spazio totale="" libero=""
  [ -d "$volume" ] || volume="/"
  spazio="$(df -Pk "$volume" 2>/dev/null | awk 'NR == 2 { printf "%.1f %.1f", $2 / 1048576, $4 / 1048576 }')"
  if [ -n "$spazio" ]; then
    totale="${spazio% *}"
    libero="${spazio#* }"
  fi

  local firewall filevault gatekeeper sip
  case "$(/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate 2>/dev/null)" in
    *enabled*|*"State = 1"*|*"State = 2"*) firewall=true ;;
    *disabled*|*"State = 0"*) firewall=false ;;
    *) firewall=null ;;
  esac
  case "$(fdesetup status 2>/dev/null)" in
    *"is On"*) filevault=true ;;
    *"is Off"*) filevault=false ;;
    *) filevault=null ;;
  esac
  case "$(spctl --status 2>/dev/null)" in
    *"assessments enabled"*) gatekeeper=true ;;
    *"assessments disabled"*) gatekeeper=false ;;
    *) gatekeeper=null ;;
  esac
  case "$(csrutil status 2>/dev/null)" in
    *"status: enabled"*) sip=true ;;
    *"status: disabled"*) sip=false ;;
    *) sip=null ;;
  esac

  # Backup: Time Machine se è configurato, oppure una cartella scelta dal tecnico
  local backup="null" ultimo="" trovato="null"
  if [ -n "$backup_path" ]; then
    if [ -d "$backup_path" ]; then
      trovato=true
      ultimo="$(find "$backup_path" -maxdepth 3 -exec /usr/bin/stat -f '%m' {} + 2>/dev/null | sort -n | tail -n 1)"
      [ -n "$ultimo" ] && [ -d "$CARTELLA" ] && printf '%s\n' "$ultimo" > "$STATO" 2>/dev/null
    else
      trovato=false
    fi
    [ -z "$ultimo" ] && [ -f "$STATO" ] && ultimo="$(head -n 1 "$STATO")"
    backup="{\"tipo\":\"Cartella\",\"percorso\":$(js "$backup_path"),\"trovato\":$trovato,\"ultimoGiorni\":$(jn "$(giorni_da "$ultimo")")}"
  elif ! tmutil destinationinfo 2>/dev/null | grep -q "No destinations configured"; then
    if tmutil destinationinfo >/dev/null 2>&1; then
      local data
      data="$(tmutil latestbackup 2>/dev/null | sed -n 's/.*\([0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}-[0-9]\{6\}\).*/\1/p')"
      if [ -n "$data" ]; then
        ultimo="$(date -j -f '%Y-%m-%d-%H%M%S' "$data" +%s 2>/dev/null)"
      else
        # Disco di Time Machine non collegato: vale l'ultima data registrata dal Mac
        data="$(defaults read /Library/Preferences/com.apple.TimeMachine 2>/dev/null |
          awk '/SnapshotDates = \(/ { f = 1; next } f && /\)/ { f = 0 } f { gsub(/[",]/, ""); gsub(/^ +/, ""); print }' | sort | tail -n 1)"
        [ -n "$data" ] && ultimo="$(date -j -u -f '%Y-%m-%d %H:%M:%S' "${data% +0000}" +%s 2>/dev/null)"
      fi
      backup="{\"tipo\":\"Time Machine\",\"percorso\":\"\",\"trovato\":null,\"ultimoGiorni\":$(jn "$(giorni_da "$ultimo")")}"
    fi
  fi

  printf '{"versione":%s,' "$VERSIONE"
  printf '"sistema":{"nome":%s,"versione":%s,"build":%s,"architettura":%s},' "$(js "$nome")" "$(js "$versione")" "$(js "$build")" "$(js "$(uname -m)")"
  printf '"computer":{"nome":%s,"produttore":"Apple","modello":%s},' "$(js "$computer")" "$(js "$modello")"
  printf '"avvioGiorni":%s,' "$(jn "$(giorni_da "$avvio")")"
  if [ -n "$totale" ]; then
    printf '"dischi":[{"unita":"Macintosh HD","totaleGB":%s,"liberoGB":%s}],' "$(jn "$totale")" "$(jn "$libero")"
  else
    printf '"dischi":[],'
  fi
  printf '"firewall":{"attivo":%s},' "$firewall"
  printf '"mac":{"filevault":%s,"gatekeeper":%s,"sip":%s},' "$filevault" "$gatekeeper" "$sip"
  printf '"backup":%s}' "$backup"
}

invia() {
  local endpoint id token backup corpo codice
  endpoint="$(leggi endpoint)"
  id="$(leggi id)"
  token="$(leggi token)"
  backup="$(leggi backup)"
  if [ -z "$endpoint" ] || [ -z "$id" ] || [ -z "$token" ]; then
    echo "Il monitoraggio non è installato su questo Mac."
    return 1
  fi
  corpo="$(report "$backup")"
  corpo="{\"dispositivo\":$(js "$id"),${corpo#\{}"
  # La chiave passa da un file temporaneo leggibile solo da root, non dalla riga di comando
  local opzioni
  opzioni="$(mktemp)"
  chmod 600 "$opzioni"
  printf 'header = "Authorization: Bearer %s"\n' "$token" > "$opzioni"
  codice="$(printf '%s' "$corpo" | curl -sS -o /dev/null -w '%{http_code}' --max-time 60 -X POST -K "$opzioni" \
    -H 'Content-Type: application/json; charset=utf-8' --data-binary @- "$endpoint" 2>>"$LOG")"
  rm -f "$opzioni"
  log "Invio: codice $codice"
  if [ "$codice" = "410" ]; then
    log "Il tecnico ha rimosso il monitoraggio: disinstallo."
    disinstalla silenzioso
  fi
  [ "$codice" = "200" ]
}

serve_root() {
  if [ "$(id -u)" -ne 0 ]; then
    echo "Serve la password dell'amministratore: scrivi il comando con sudo davanti." >&2
    exit 1
  fi
}

installa() {
  serve_root
  local endpoint="${1:-}" id="${2:-}" token="${3:-}" backup="${4:-}"
  case "$endpoint" in https://*) ;; *) echo "L'indirizzo deve iniziare con https://" >&2; exit 1 ;; esac
  if ! printf '%s' "$id" | grep -Eq '^[0-9a-z]{17}$'; then echo "Codice del Mac non valido: copia di nuovo il comando dal pannello." >&2; exit 1; fi
  if ! printf '%s' "$token" | grep -Eq '^[A-Za-z0-9_-]{20,}$'; then echo "Chiave non valida: copia di nuovo il comando dal pannello." >&2; exit 1; fi

  mkdir -p "$CARTELLA"
  chmod 700 "$CARTELLA"
  chown root:wheel "$CARTELLA"
  if [ "$(cd "$(dirname "$0")" && pwd)/$(basename "$0")" != "$SCRIPT" ]; then
    cp "$0" "$SCRIPT"
  fi
  chmod 700 "$SCRIPT"
  xattr -d com.apple.quarantine "$SCRIPT" 2>/dev/null || true
  umask 077
  printf 'endpoint=%s\nid=%s\ntoken=%s\nbackup=%s\n' "$endpoint" "$id" "$token" "$backup" > "$CONFIG"
  chmod 600 "$CONFIG"

  cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$ETICHETTA</string>
  <key>ProgramArguments</key>
  <array><string>/bin/bash</string><string>$SCRIPT</string><string>run</string></array>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>10</integer><key>Minute</key><integer>0</integer></dict>
  <key>RunAtLoad</key><true/>
  <key>StandardOutPath</key><string>/dev/null</string>
  <key>StandardErrorPath</key><string>/dev/null</string>
</dict>
</plist>
EOF
  chown root:wheel "$PLIST"
  chmod 644 "$PLIST"
  launchctl bootout system "$PLIST" 2>/dev/null || true
  # RunAtLoad invia subito il primo controllo
  if launchctl bootstrap system "$PLIST" 2>/dev/null || launchctl load -w "$PLIST" 2>/dev/null; then
    echo "Fatto! Tra un minuto il Mac compare nel pannello di Gabriel Tech."
  else
    echo "Installato, ma non riesco ad avviare il controllo automatico. Il registro è in: $LOG" >&2
  fi
}

disinstalla() {
  # Prima i file, poi il servizio: se è il servizio stesso a disinstallarsi, viene fermato per ultimo
  rm -f "$PLIST"
  rm -rf "$CARTELLA"
  [ "${1:-}" = "silenzioso" ] || echo "Monitoraggio di Gabriel Tech rimosso da questo Mac."
  launchctl bootout "system/$ETICHETTA" 2>/dev/null || launchctl remove "$ETICHETTA" 2>/dev/null || true
}

case "${1:-run}" in
  install) shift; installa "$@" ;;
  uninstall) serve_root; disinstalla ;;
  preview) report "${2:-}"; echo ;;
  run) invia ;;
  *) echo "Uso: sudo bash $0 install <indirizzo> <codice> <chiave> [cartella-backup] | uninstall | preview" >&2; exit 1 ;;
esac
