window.CalcApp = window.CalcApp || {};

CalcApp.generator = {
    generateAddition: function(level) {
        let min, max;
        
        switch(level) {
            case '1':
                min = 0;
                max = 9;
                break;
            case '2':
                min = 10;
                max = 99;
                break;
            case '3':
                min = 100;
                max = 999;
                break;
            default:
                min = 0;
                max = 9;
        }
        
        const a = CalcApp.utils.getRandomInt(min, max);
        const b = CalcApp.utils.getRandomInt(min, max);
        
        return {
            a: a,
            b: b,
            op: '+',
            answer: a + b,
            display: `${a} + ${b}`
        };
    },
    
    generateSubtraction: function(level) {
        let min, max;
        
        switch(level) {
            case '1':
                min = 0;
                max = 9;
                break;
            case '2':
                min = 10;
                max = 99;
                break;
            case '3':
                min = 100;
                max = 999;
                break;
            default:
                min = 0;
                max = 9;
        }
        
        let a = CalcApp.utils.getRandomInt(min, max);
        let b = CalcApp.utils.getRandomInt(min, max);
        
        if (b > a) {
            [a, b] = [b, a];
        }
        
        return {
            a: a,
            b: b,
            op: '-',
            answer: a - b,
            display: `${a} - ${b}`
        };
    },
    
    generateMultiplication: function(table) {
        const tableNum = parseInt(table);
        const multiplier = CalcApp.utils.getRandomInt(1, 12);
        
        return {
            a: tableNum,
            b: multiplier,
            op: '×',
            answer: tableNum * multiplier,
            display: `${tableNum} × ${multiplier}`
        };
    },
    
    generateDivision: function(table) {
        const divisor = parseInt(table);
        const quotient = CalcApp.utils.getRandomInt(1, 12);
        const dividend = divisor * quotient;
        
        return {
            a: dividend,
            b: divisor,
            op: '÷',
            answer: quotient,
            display: `${dividend} ÷ ${divisor}`
        };
    },
    
    generateQuestions: function(mode, level, table, count = 20) {
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            let question;
            
            switch(mode) {
                case 'add':
                    question = this.generateAddition(level);
                    break;
                case 'sub':
                    question = this.generateSubtraction(level);
                    break;
                case 'mul':
                    question = this.generateMultiplication(table);
                    break;
                case 'div':
                    question = this.generateDivision(table);
                    break;
                default:
                    question = this.generateAddition('1');
            }
            
            questions.push(question);
        }
        
        if (mode === 'mul' || mode === 'div') {
            return CalcApp.utils.shuffleArray(questions);
        }
        
        return questions;
    }
};