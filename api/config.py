import os
from dotenv import load_dotenv


load_dotenv()


def _getenv(key, default=None, mandatory=True):
    if mandatory:
        if key in os.environ or default is not None:
            return os.getenv(key, default)
        raise KeyError("environment variable '%s' not set" % key)
    return os.getenv(key, default)


# WEB SERVER

ENVIRONMENT =       _getenv('ENVIRONMENT',      default='dev')
PORT =              _getenv('PORT',             default=5000)
HOST =              _getenv('HOST',             default=f"http://127.0.0.1:{PORT}")
ORIGINS =           _getenv('ORIGINS',          default="http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:5000").split(",")
WEBAPP_ENDPOINT =   _getenv('WEBAPP_ENDPOINT',  default="http://127.0.0.1:3000")

# AUTH

JWT_SECRET_KEY =    _getenv('JWT_SECRET_KEY',  default='D3f4ult_K3Y')

# DATABASE

DB_CONFIG = {
    'drivername':   _getenv('DB_DRIVER',    default='mongodb'),
    'host':         _getenv('DB_HOSTNAME',  default='localhost'),
    'port':         _getenv('DB_PORT',      default='27017'),
    'database':     _getenv('DB_NAME',      default='mfl-assistant'),
    'username':     _getenv('DB_USERNAME',  default='root'),
    'password':     _getenv('DB_PASSWORD',  default='password'),
    'query':        {'charset': _getenv('DB_CHARSET', default='utf8mb4')},
}
DB_URL = f"{DB_CONFIG['drivername']}://{DB_CONFIG['username']}:{DB_CONFIG['password']}" \
         f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}" \
         f"?authSource=admin"

# EMAIL

MAIL_CONFIG = {
	'MAIL_USERNAME': 	_getenv('MAIL_USERNAME',        default=''),
	'MAIL_PASSWORD': 	_getenv('MAIL_PASSWORD',        default=''),
	'MAIL_SERVER': 		_getenv('MAIL_SERVER',          default='127.0.0.1'),
	'MAIL_PORT': 		_getenv('MAIL_PORT',  	        default='1025'),
	'MAIL_FROM': 		_getenv('MAIL_FROM',  	        default='test@example.com'),
	'MAIL_STARTTLS': 	_getenv('MAIL_STARTTLS',        default=True),
	'MAIL_SSL_TLS': 	_getenv('MAIL_SSL_TLS',         default=True),
	'USE_CREDENTIALS': 	_getenv('MAIL_USE_CREDENTIALS', default=True),
	'VALIDATE_CERTS': 	_getenv('MAIL_VALIDATE_CERTS',  default=True),
}