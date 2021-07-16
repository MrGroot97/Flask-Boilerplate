openssl genrsa -des3 -out flaskserver.key 1024
openssl req -new -key flaskserver.key -out flaskserver.csr
cp flaskserver.key flaskserver.key.org
openssl rsa -in flaskserver.key.org -out flaskserver.key
openssl x509 -req -days 365 -in flaskserver.csr -signkey flaskserver.key -out flaskserver.crt

pip install -r requirement.txt

python app.py