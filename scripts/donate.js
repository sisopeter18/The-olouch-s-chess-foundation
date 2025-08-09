// render m-pesa donation form
function renderMpesaForm() {
    let html = `
        <form class="m-pesa-form">
            <label for="mpesa-amount">Amount</label>
            <input type="text" id="mpesa-amount" placeholder="Amount" required>
            <label for="mpesa-number">M-Pesa Number</label>
            <input type="tel" id="mpesa-number" placeholder="M-Pesa Number" required>
            <button type="submit">Donate</button>
        </form>
    `;
    document.querySelector('.donate-form').innerHTML = html;
}

renderMpesaForm();

function showLoader() {
    document.querySelector('.wrapper').classList.remove('hidden');
    document.querySelector('.loader').style.animation = 'spin 1s linear infinite';
}

function hideLoader() {
    document.querySelector('.wrapper').classList.add('hidden');
    document.querySelector('.loader').style.animation = 'none';
}

let donateForm = document.querySelector('.donate-form');
donateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let amount = document.querySelector('#mpesa-amount').value;
    let number = document.querySelector('#mpesa-number').value;

    if (!amount || !number) {
        alert('Please enter both amount and M-Pesa number.');
        return;
    }

    // check if amount is a positive integer
    if (isNaN(amount) || !Number.isInteger(Number(amount)) || amount <= 0) {
        alert('Invalid amount.');
        return;
    }

    if (!number.startsWith('254') && !number.startsWith('07') && !number.startsWith('+254') && !number.startsWith('01')) {
        alert('Please enter a valid phone number.');
        return;
    }

    if (number.startsWith('01') && number.length !== 10 || number.startsWith('07') && number.length !== 10) {
        alert('Please check phone number length.');
        return;
    }
    if (number.startsWith('+254') && number.length !== 13) {
        alert('Please check phone number length.');
        return;
    }
    if (number.startsWith('254') && number.length !== 12) {
        alert('Please check phone number length.');
        return;
    }

    if (number.startsWith('0')) {
        number = number.replace('0', '254');
    } else if (number.startsWith('+254')) {
        number = number.replace('+254', '254');
    }

    // convert number and amount to string
    amount = amount.toString();
    number = number.toString();

    // prepare data to be sent to the server
    let donationData = new FormData();
    donationData.append('amount', amount);
    donationData.append('number', number);

    // send data to the server using AJAX
    $.ajax({
        type: 'POST',
        url: 'donate.php',
        data: donationData,
        processData: false,
        contentType: false,
        dataType: 'json', // expect JSON response
        beforeSend: function () {
            showLoader();
        },
        success: function (response) {
            // handle response from server
            if (response.status === 'success') {
                alert(response.message || 'Donation initiated successfully. Please check your phone to authorize transaction.');
            } else {
                alert(response.message || 'Donation failed.');
            }
        },
        error: function (xhr) {
            // handle error
            alert(xhr.status + ': ' + xhr.statusText);
            console.log(xhr.responseText);
        },
        complete: function () {
            hideLoader();
        }
    });
});