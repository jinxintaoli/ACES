console.log('ACES loaded');
document.addEventListener('DOMContentLoaded', function() {
    var mainContent = document.getElementById('main-content');
    var loadingSpinner = document.querySelector('.loading-spinner');
    
    if (mainContent && loadingSpinner) {
        fetch('./pages/dashboard.html')
            .then(function(r) { return r.text(); })
            .then(function(html) {
                mainContent.innerHTML = html;
                loadingSpinner.style.display = 'none';
            })
            .catch(function(e) {
                mainContent.innerHTML = '<h2>ACES Platform</h2><p>Basic version loaded</p>';
                loadingSpinner.style.display = 'none';
            });
    }
});
