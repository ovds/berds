import {Html5Qrcode, Html5QrcodeScanner} from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Scanner(props: {success: Function}) {
    let html5QrCode: Html5Qrcode;
    const qrcodeId = "qr-code-reader";

    useEffect(() => {
        // Anything in here is fired on component mount.
        if(!html5QrCode?.getState()){
            html5QrCode = new Html5Qrcode(qrcodeId);
            const success = (result: String) => {
                props.success(result);
                html5QrCode.stop().then(r => console.log(r)).catch(e => console.log(e));
            };

            const error = (err: String) => {
                //console.log(err)
            }

            const config = { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1};

            html5QrCode.start({ facingMode: "environment" }, config, success, error);
        }
    }, []);

    return <div id={qrcodeId}></div>;
}