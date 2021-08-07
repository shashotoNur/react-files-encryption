const deriveKey = async (passkey) =>
{
    try
    {
        // Create a PBKDF2 "key" containing the password
        const passwordKey = await window.crypto.subtle.importKey(
                "raw", new TextEncoder().encode(passkey),
                {"name": "PBKDF2"}, false, ["deriveKey"]
        );

        // Derive a key from the password key
        const getKey = (passwordKey) =>
        {
            return window.crypto.subtle.deriveKey(
                { "name": "PBKDF2", "salt": new TextEncoder().encode('salt'), "iterations": 1000, "hash": 'SHA-256' },
                passwordKey,
                {"name": "AES-GCM", "length": 128},
                true,
                ["encrypt", "decrypt"]
            );
        };

        const key = getKey(passwordKey);
        return key;
    }
    catch (err) { console.log(err.message); };
};

export default deriveKey;