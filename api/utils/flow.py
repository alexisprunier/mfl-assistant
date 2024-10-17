from flow_py_sdk.exceptions import PySDKError
from flow_py_sdk.client import AccessAPI, flow_client
from flow_py_sdk.script import Script
from flow_py_sdk.utils import CompositeSignature
from flow_py_sdk import cadence, utils
from rlp import encode
from utils.nonce import cleanup_nonces, is_nonce_valid


async def verify_signature(service):
    try:
        account_address = service["address"]
        nonce = service["nonce"]
        key_id = service["signatures"][0]["keyId"]
        signature = service["signatures"][0]["signature"]
    except KeyError:
        return False

    #TODO###
    cleanup_nonces()
    return is_nonce_valid(nonce)
    #####

    async with flow_client(host="access.mainnet.nodes.onflow.org", port=9000) as client:
        account = await client.get_account(
            address=cadence.Address.from_hex(account_address)
        )

        fields = encode(
            [
                "mfl-assistant",
                account.address,
                bytes.fromhex(nonce)
            ]
        )

        signer = CompositeSignature(
            addr=account.address.hex(),
            keyId=key_id,
            signature=signature
        )

        signature_is_valid = await utils.verify_user_signature(
            message=bytes(fields.hex(), "utf-8"),
            client=client,
            composite_signatures=[signer],
        )

        return signature_is_valid
