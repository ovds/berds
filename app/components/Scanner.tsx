import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function Scanner() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: {width: 250, height: 250} }, false);
        scanner.render(success, error);

        function success(result: string) {
            setScanResult(result);
            scanner.clear();
        }

        function error(err: any) {
            console.log(err);
        }
    }, []);

    return (
        <div>
            { scanResult
                ? <h2>{scanResult}</h2>
                : <div id="reader"></div>
            }
        </div>
    )
}