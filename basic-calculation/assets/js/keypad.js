window.CalcApp = window.CalcApp || {};

CalcApp.keypad = {
    inputBuffer: '',
    callbacks: {
        onNumber: null,
        onBackspace: null,
        onClear: null,
        onOk: null
    },
    
    init: function(callbacks) {
        this.callbacks = callbacks || {};
        this.inputBuffer = '';
        this.setupEventListeners();
        this.updateOkButton();
    },
    
    setupEventListeners: function() {
        const keypad = document.getElementById('keypad');
        if (!keypad) return;
        
        keypad.addEventListener('click', (e) => {
            if (e.target.classList.contains('keypad-btn')) {
                const value = e.target.dataset.value;
                const action = e.target.dataset.action;
                
                if (value !== undefined) {
                    this.handleNumber(value);
                } else if (action) {
                    this.handleAction(action);
                }
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                e.preventDefault();
                this.handleNumber(e.key);
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                this.handleAction('backspace');
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.handleAction('clear');
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (this.inputBuffer.length > 0) {
                    this.handleAction('ok');
                }
            }
        });
    },
    
    handleNumber: function(num) {
        this.inputBuffer += num;
        this.updateDisplay();
        this.updateOkButton();
        
        if (this.callbacks.onNumber) {
            this.callbacks.onNumber(num);
        }
    },
    
    handleAction: function(action) {
        switch(action) {
            case 'backspace':
                if (this.inputBuffer.length > 0) {
                    this.inputBuffer = this.inputBuffer.slice(0, -1);
                    this.updateDisplay();
                    this.updateOkButton();
                    
                    if (this.callbacks.onBackspace) {
                        this.callbacks.onBackspace();
                    }
                }
                break;
                
            case 'clear':
                this.inputBuffer = '';
                this.updateDisplay();
                this.updateOkButton();
                
                if (this.callbacks.onClear) {
                    this.callbacks.onClear();
                }
                break;
                
            case 'ok':
                if (this.inputBuffer.length > 0) {
                    const value = parseInt(this.inputBuffer);
                    
                    if (this.callbacks.onOk) {
                        this.callbacks.onOk(value);
                    }
                }
                break;
        }
    },
    
    updateDisplay: function() {
        const display = document.getElementById('answer-display');
        if (display) {
            display.textContent = this.inputBuffer || '';
        }
    },
    
    updateOkButton: function() {
        const okBtn = document.querySelector('.keypad-btn.ok');
        if (okBtn) {
            okBtn.disabled = this.inputBuffer.length === 0;
        }
    },
    
    clear: function() {
        this.inputBuffer = '';
        this.updateDisplay();
        this.updateOkButton();
    },
    
    disable: function() {
        const buttons = document.querySelectorAll('.keypad-btn');
        buttons.forEach(btn => {
            btn.disabled = true;
        });
    },
    
    enable: function() {
        const buttons = document.querySelectorAll('.keypad-btn');
        buttons.forEach(btn => {
            if (!btn.classList.contains('ok')) {
                btn.disabled = false;
            }
        });
        this.updateOkButton();
    }
};