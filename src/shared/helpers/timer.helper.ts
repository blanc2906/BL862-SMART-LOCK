export class TimeHelper {
    private static addZeroForNum(num: string, length: number): string {
        return num.padStart(length, '0');
    }
    static getCurrentTimeFormat(): string {
        const now = new Date();
        
        const year = now.getFullYear() % 100;
        
        const month = now.getMonth() + 1;
        
        const date = now.getDate();
        
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        

        const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
        return (
            this.addZeroForNum(year.toString(), 2) +
            this.addZeroForNum(month.toString(), 2) +
            this.addZeroForNum(date.toString(), 2) +
            this.addZeroForNum(hours.toString(), 2) +
            this.addZeroForNum(minutes.toString(), 2) +
            this.addZeroForNum(seconds.toString(), 2) +
            '0' +
            dayOfWeek
        );
    }
}