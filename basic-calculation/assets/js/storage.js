window.CalcApp = window.CalcApp || {};

CalcApp.storage = {
    savePreferences: function(prefs) {
        localStorage.setItem('calcPreferences', JSON.stringify(prefs));
    },
    
    loadPreferences: function() {
        const prefs = localStorage.getItem('calcPreferences');
        return prefs ? JSON.parse(prefs) : null;
    },
    
    saveHistory: function(entry) {
        let history = this.loadHistory();
        history.unshift(entry);
        
        if (history.length > 10) {
            history = history.slice(0, 10);
        }
        
        localStorage.setItem('calcHistory', JSON.stringify(history));
    },
    
    loadHistory: function() {
        const history = localStorage.getItem('calcHistory');
        return history ? JSON.parse(history) : [];
    },
    
    clearHistory: function() {
        localStorage.removeItem('calcHistory');
    }
};