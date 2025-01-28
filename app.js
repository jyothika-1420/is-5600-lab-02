// Main application code
document.addEventListener('DOMContentLoaded', () => {
    // Parse JSON data
    const stocksData = JSON.parse(stockContent);
    const userData = JSON.parse(userContent);
    
    // Get UI elements
    const saveButton = document.querySelector('#saveButton');
    const deleteButton = document.querySelector('#deleteButton');
    
    // Initial render
    generateUserList(userData, stocksData);
    
    // Delete user handler
    deleteButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userId = document.querySelector('#userID').value;
        const userIndex = userData.findIndex(user => user.id == userId);
        if (userIndex !== -1) {
            userData.splice(userIndex, 1);
            generateUserList(userData, stocksData);
            clearForm();
            clearPortfolio();
            clearStockView(); // Clear stock view when user is deleted
        }
    });
    
    // Save user handler
    saveButton.addEventListener('click', (event) => {
        event.preventDefault(); // Fixed 'e' to 'event'
        const id = document.querySelector('#userID').value;
        
        const userToUpdate = userData.find(user => user.id == id);
        if (userToUpdate) {
            userToUpdate.user.firstname = document.querySelector('#firstname').value;
            userToUpdate.user.lastname = document.querySelector('#lastname').value;
            userToUpdate.user.address = document.querySelector('#address').value;
            userToUpdate.user.city = document.querySelector('#city').value;
            userToUpdate.user.email = document.querySelector('#email').value;
            
            generateUserList(userData, stocksData);
        }
    });
});

function generateUserList(users, stocks) {
    const userList = document.querySelector('.user-list');
    userList.innerHTML = ''; // Clear existing list
    
    users.forEach(({ user, id }) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${user.lastname}, ${user.firstname}`;
        listItem.setAttribute('id', id);
        // Add selected class if this user is currently selected
        if (id == document.querySelector('#userID').value) {
            listItem.classList.add('selected');
        }
        userList.appendChild(listItem);
    });
    
    userList.addEventListener('click', (event) => handleUserListClick(event, users, stocks));
}

function handleUserListClick(event, users, stocks) {
    if (event.target.tagName === 'LI') {
        const userId = event.target.id;
        const user = users.find(user => user.id == userId);
        if (user) {
            // Remove selected class from all items
            document.querySelectorAll('.user-list li').forEach(li => {
                li.classList.remove('selected');
            });
            // Add selected class to clicked item
            event.target.classList.add('selected');
            
            populateForm(user);
            renderPortfolio(user, stocks);
        }
    }
}

function populateForm(data) {
    const { user, id } = data;
    document.querySelector('#userID').value = id;
    document.querySelector('#firstname').value = user.firstname;
    document.querySelector('#lastname').value = user.lastname;
    document.querySelector('#address').value = user.address;
    document.querySelector('#city').value = user.city;
    document.querySelector('#email').value = user.email;
}

function renderPortfolio(user, stocks) {
    const { portfolio } = user;
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = '';
    
    // Add header row
    const headerRow = document.createElement('div');
    headerRow.className = 'portfolio-row header';
    headerRow.innerHTML = `
        <div class="symbol">Symbol</div>
        <div class="shares">Shares</div>
        <div class="action">Action</div>
    `;
    portfolioDetails.appendChild(headerRow);
    
    // Add portfolio items
    portfolio.forEach(({ symbol, owned }) => {
        const row = document.createElement('div');
        row.className = 'portfolio-row';
        
        const symbolDiv = document.createElement('div');
        symbolDiv.className = 'symbol';
        symbolDiv.textContent = symbol;
        
        const sharesDiv = document.createElement('div');
        sharesDiv.className = 'shares';
        sharesDiv.textContent = owned;
        
        const actionDiv = document.createElement('div');
        actionDiv.className = 'action';
        const viewButton = document.createElement('button');
        viewButton.textContent = 'View';
        viewButton.setAttribute('data-symbol', symbol);
        actionDiv.appendChild(viewButton);
        
        row.appendChild(symbolDiv);
        row.appendChild(sharesDiv);
        row.appendChild(actionDiv);
        portfolioDetails.appendChild(row);
    });
    
    // Add click handler for view buttons
    portfolioDetails.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON') {
            const symbol = event.target.getAttribute('data-symbol');
            viewStock(symbol, stocks);
        }
    });
}

function viewStock(symbol, stocks) {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        const stock = stocks.find(s => s.symbol == symbol);
        if (stock) {
            stockArea.style.display = 'block';
            document.querySelector('#stockName').textContent = stock.name;
            document.querySelector('#stockSector').textContent = stock.sector;
            document.querySelector('#stockIndustry').textContent = stock.subIndustry;
            document.querySelector('#stockAddress').textContent = stock.address;
            
            const logo = document.querySelector('#logo');
            logo.src = `logos/${symbol}.svg`;
            logo.alt = `${stock.name} logo`;
        }
    }
}

function clearForm() {
    document.querySelector('#userID').value = '';
    document.querySelector('#firstname').value = '';
    document.querySelector('#lastname').value = '';
    document.querySelector('#address').value = '';
    document.querySelector('#city').value = '';
    document.querySelector('#email').value = '';
}

function clearPortfolio() {
    const portfolioDetails = document.querySelector('.portfolio-list');
    portfolioDetails.innerHTML = '';
}

function clearStockView() {
    const stockArea = document.querySelector('.stock-form');
    if (stockArea) {
        stockArea.style.display = 'none';
        document.querySelector('#stockName').textContent = '';
        document.querySelector('#stockSector').textContent = '';
        document.querySelector('#stockIndustry').textContent = '';
        document.querySelector('#stockAddress').textContent = '';
        document.querySelector('#logo').src = '';
    }
}
  
