import secrets
from fastapi.responses import JSONResponse
from utils.nonce import store_nonce


def generate_nonce(self):
    nonce = secrets.token_bytes(32)
    nonce_hex = str(nonce.hex())
    store_nonce(nonce_hex)
    return JSONResponse(content={"nonce": nonce_hex})
