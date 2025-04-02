async function processWithDelay(numbers: number[], deplay: number, callback: (progress: string) => void): Promise<void> {
    const totalNumbers = numbers.length;
    let currentNumber = 0;

    for (const number of numbers) {

        //Thêm deplay để kiếm soát thời gian chờ
        await new Promise((resolve) => setTimeout(resolve, deplay));
        console.log(number);

        //Tiến trình
        currentNumber++;
        const progress = `${currentNumber}/${totalNumbers}`;
        callback(progress);
    }
}

const numbers = [1, 2, 3, 4, 5];
processWithDelay(numbers, 1000, (progress) => {
    console.log(`Tiến độ: ${progress}`);
});