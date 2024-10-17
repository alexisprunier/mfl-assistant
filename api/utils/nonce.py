import time

nonces = {}

# Function to store nonce with timestamp
def store_nonce(nonce):
    current_time = time.time()
    # Store nonce with current timestamp
    nonces[nonce] = current_time

# Function to check validity of nonce
def is_nonce_valid(nonce):
    current_time = time.time()
    # Check if nonce exists and is less than 24 hours old
    if nonce in nonces and (current_time - nonces[nonce]) < 86400:
        return True
    return False

# Function to clean up expired nonces (this should run periodically)
def cleanup_nonces():
    current_time = time.time()
    expired_nonces = [nonce for nonce, timestamp in nonces.items() if (current_time - timestamp) >= 86400]
    for nonce in expired_nonces:
        del nonces[nonce]