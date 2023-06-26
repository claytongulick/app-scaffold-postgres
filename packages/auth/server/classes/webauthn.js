import { Fido2Lib } from 'fido2-lib';
let f2l = new Fido2Lib({
    protocol: 'https',
    origin: `https://${process.env.CLIENT_ID}.${process.env.HOSTNAME}`,
    timeout: 15 * 60,
    rpId: process.env.HOSTNAME,
    rpName: process.env.APP_NAME,
    rpIcon: process.env.APP_LOGO,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "required"
});
class WebAuthn {

}