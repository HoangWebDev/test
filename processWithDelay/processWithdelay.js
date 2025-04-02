"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function processWithDelay(numbers, deplay, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const totalNumbers = numbers.length;
        let currentNumber = 0;
        for (const number of numbers) {
            //Thêm deplay để kiếm soát thời gian chờ
            yield new Promise((resolve) => setTimeout(resolve, deplay));
            console.log(number);
            //Tiến trình
            currentNumber++;
            const progress = `${currentNumber}/${totalNumbers}`;
            callback(progress);
        }
    });
}
const numbers = [1, 2, 3, 4, 5];
processWithDelay(numbers, 1000, (progress) => {
    console.log(`Tiến độ: ${progress}`);
});
