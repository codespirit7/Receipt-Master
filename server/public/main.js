async function onDownload() {
  showSpinner();
  const data = await fetch("/api/invoices").then((res) => res.json());
  easyinvoice.createInvoice(data, function (result) {
    easyinvoice.download("myInvoice.pdf", result.pdf);
  });
  removeSpinner();
}

async function onView() {
  showSpinner();
  // document.getElementById("mailbtn").style.display = "block";
  const data = await fetch("/api/invoices").then((res) => res.json());
  console.log(data);
  const elementId = "pdf";
  const result = await easyinvoice.createInvoice(data);
  await easyinvoice.render(elementId, result.pdf);
  removeSpinner();
  document.getElementById("invoice_form").style.display = "none";
}

async function onMail() {
  const data = await fetch("/api/invoices/mail");
  document.getElementById("notify").style.display = "block";
}

function onSubmit(e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const mobile = document.querySelector("#mobile").value;
  const add = document.querySelector("#address").value;

  var products = [];

  var table = document.getElementById("productTable");
  var products = [];
  var table = document.getElementById("productTable");
  for (var i = 1; i < table.rows.length; i++) {
    var row = table.rows[i];
    var productDetails = {
      quantity: row.cells[1].children[0].value,
      description: row.cells[0].children[0].value,
      "tax-rate": 5,
      price: row.cells[2].children[0].value,
    };
    products.push(productDetails);
  }
  console.log(productDetails);

  document.getElementById("invoice_form").style.display = "none";
  document.getElementById("btn-hide").style.display = "block";

  invoiceDataRequest(name, email, mobile, add, products);
}

async function invoiceDataRequest(name, email, mobile, address, products) {
  try {
    const response = await fetch("/api/invoices", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        mobile,
        address,
        products,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

let i = 0;

function onClick() {
  var table = document.getElementById("productTable");
  var row = table.insertRow(-1);
  var col1 = row.insertCell(0);
  var col2 = row.insertCell(1);
  var col3 = row.insertCell(2);
  col1.innerHTML = "<input type='text' name='name'>";
  col2.innerHTML = "<input type='text' name='quantity'>";
  col3.innerHTML = "<input type='text' name='price'>";
}

function showSpinner() {
  document.querySelector(".spinner").classList.add("show");
}

function removeSpinner() {
  document.querySelector(".spinner").classList.remove("show");
}

document.querySelector("#add").addEventListener("click", onClick);
document.querySelector("#invoice_form").addEventListener("submit", onSubmit);
document.querySelector("#downloadbtn").addEventListener("click", onDownload);
document.querySelector("#viewbtn").addEventListener("click", onView);
document.querySelector("#mailbtn").addEventListener("click", onMail);
