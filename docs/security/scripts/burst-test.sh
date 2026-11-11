#!/usr/bin/env bash
# Rate-limit burst test against a Deploy Preview (never production).
# Posts the no-JS contact form with an EMPTY message: each request counts
# towards the limit but fails validation, so it can never send mail.
# Run only after 10 idle minutes from your IP. Expected with the shared
# Blobs window: exactly 5 "status":"error" (accepted), the rest rateLimited.
# Usage: bash docs/security/scripts/burst-test.sh [preview-url]
P=${1:-https://deploy-preview-1--4tunhub.netlify.app}
C="curl -sS --ssl-no-revoke"   # --ssl-no-revoke: Windows schannel revocation lookups fail here
for t in 1 2 3 4 5 6 7 8; do H=$($C $P/en/contact 2>/dev/null); AID=$(echo "$H" | grep -oE 'name="\$ACTION_2:0" value="[^"]*"' | sed 's/&quot;/"/g;s/.*value="//;s/"$//'); [ -n "$AID" ] && break; sleep 2; done
KEY=$(echo "$H" | grep -oE 'name="\$ACTION_KEY" value="[^"]*"' | head -1 | sed 's/.*value="//;s/"$//')
post(){ for t in 1 2 3 4 5; do r=$($C --max-time 40 -X POST $P/en/contact -H "Origin: $P" -H "x-nf-client-connection-ip: 198.51.100.$1" -H "X-Forwarded-For: 203.0.113.$1" -F '$ACTION_REF_2=' -F "\$ACTION_2:0=$AID" -F '$ACTION_2:1=[{"status":"idle"}]' -F "\$ACTION_KEY=$KEY" -F name=T -F email=t@example.com -F topic=other -F message= -F company_website= -w ' T=%{time_total}' 2>/dev/null); s=$(echo "$r" | grep -oE 'name="\$ACTION_2:1" value="[^"]*"' | sed 's/&quot;/"/g' | grep -oE '"(formError|status)":"[a-zA-Z]+"' | tail -1); [ -n "$s" ] && { echo "$s$(echo "$r" | grep -oE ' T=[0-9.]+$') (try $t)"; return; }; sleep 1; done; echo "NO RESPONSE"; }
echo "start $(date -u +%T)"
for i in 1 2 3; do echo "seq $i: $(post $i)"; done
for i in 4 5 6 7; do ( echo "par $i: $(post $i)" ) & done; wait
for i in 8 9; do echo "seq $i: $(post $i)"; done
