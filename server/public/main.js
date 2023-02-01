async function onDownload() {
  const data = await fetch("/api/invoices").then((res) => res.json());
  easyinvoice.createInvoice(data, function (result) {
    easyinvoice.download("myInvoice.pdf", result.pdf);
  });
}

async function onView() {
  const data = await fetch("/api/invoices").then((res) => res.json());

  const elementId = "pdf";
  const result = await easyinvoice.createInvoice(data);
  await easyinvoice.render(elementId, result.pdf);

  document.getElementById("invoice_form").style.display = "none";
}

async function onMail() {
  const data = await fetch("/api/invoices/mail");
}

function onSubmit(e) {
  e.preventDefault();

  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const mobile = document.querySelector("#mobile").value;
  const add = document.querySelector("#address").value;
  const product = document.querySelector("#c1").value;
  const qty = document.querySelector("#c2").value;
  const price = document.querySelector("#c3").value;

  document.getElementById("invoice_form").style.display = "none";
  document.getElementById("btn-hide").style.display = "block";

  invoiceDataRequest(name, email, mobile, add, product, qty, price);
}

async function invoiceDataRequest(
  name,
  email,
  mobile,
  address,
  product,
  quantity,
  price
) {
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
        product,
        quantity,
        price,
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

let i = 1;

function onClick() {
  var table = document.getElementById("productTable");
  var row = table.insertRow(-1);
  var ser_no = row.insertCell(0);
  var product = row.insertCell(1);
  var qty = row.insertCell(2);
  var price = row.insertCell(3);

  var c1 = document.querySelector("#c1").outerHTML;
  var c2 = document.querySelector("#c2").outerHTML;
  var c3 = document.querySelector("#c3").outerHTML;
  ser_no.innerHTML = ++i;
  product.innerHTML = c1;
  qty.innerHTML = c2;
  price.innerHTML = c3;
}

document.querySelector("#add").addEventListener("click", onClick);
document.querySelector("#invoice_form").addEventListener("submit", onSubmit);
document.querySelector("#downloadbtn").addEventListener("click", onDownload);
document.querySelector("#viewbtn").addEventListener("click", onView);
document.querySelector("#mailbtn").addEventListener("click", onMail);
