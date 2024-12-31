export class StringHelper {
    static strTo16(value: string): string {
        return BigInt(value).toString(16).toLowerCase();
    }

    static addZeroForNum(str: string, length: number): string {
        let result = str;
        while (result.length < length) {
            result = '0' + result;
        }
        return result;
    }

    static changeByte(s: string): string {
        const bytes = Buffer.from(s);
        const length = bytes.length;
        
        for (let i = 0; i < length / 2; i += 2) {
            let temp = bytes[i];
            bytes[i] = bytes[length - i - 2];
            bytes[length - i - 2] = temp;
            
            temp = bytes[i + 1];
            bytes[i + 1] = bytes[length - i - 1];
            bytes[length - i - 1] = temp;
        }
        
        return bytes.toString();
    }

    static processCardNumber(cardNo: string): string {
        let processed = this.addZeroForNum(this.strTo16(cardNo), 8);
        processed = this.changeByte(processed);
        return processed;
    }
}