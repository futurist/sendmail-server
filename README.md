# Sendmail Server
Sendmail server daemon using nodemailer, REST API for mail.

# Usage
```
npm i
node . <PASS> <SENDER>
```

Example start:
```
node . abc123 abc@126.com
```

Then send email with below:
```
curl -X GET -G http://localhost:9191/sendmail \
-d to=xyz@gmail.com \
-d subject=Hello \
--data-urlencode 'html=<b>Hello from James</b>'
```

# FAQ
Default this lib using 126.com mailbox to work, you can change it with
```
curl http://localhost:9191/config?host=smtp.qq.com
```


