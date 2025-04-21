const registrarBtn = document.getElementById("registrar-btn");
const totalVentas = document.getElementById("total");
const ventasChart = document.getElementById("ventasChart").getContext("2d");
const borrarRegistrosBtn = document.getElementById("borrarRegistrosBtn");
const agregarProductoBtn = document.getElementById("agregarProductoBtn");
const modal = document.getElementById("modal");
const cerrarModalBtn = document.getElementById("cerrarModalBtn");
const guardarProductoBtn = document.getElementById("guardarProductoBtn");
const nuevoProductoInput = document.getElementById("nuevoProducto");
const precioProductoInput = document.getElementById("precioProducto");
const registrosLista = document.getElementById("registrosLista");

let ventas = {
  "Waka Titan": { cantidad: 0, precio: 450 },
  "Iplay Box": { cantidad: 0, precio: 300 },
  "Rabbeats": { cantidad: 0, precio: 250 },
  "Tyzon": { cantidad: 0, precio: 270 },
  "PacksPod": { cantidad: 0, precio: 320 }
};

let registros = JSON.parse(localStorage.getItem("registros")) || [];

function actualizarTotal() {
  let total = 0;
  for (const producto in ventas) {
    total += ventas[producto].cantidad * ventas[producto].precio;
  }
  totalVentas.textContent = total.toFixed(2);
}

function guardarRegistros() {
  const fecha = new Date().toLocaleDateString();
  const total = parseFloat(totalVentas.textContent);
  const registro = {
    fecha,
    total,
    productos: Object.entries(ventas).map(([producto, datos]) => ({
      nombre: producto,
      cantidad: datos.cantidad,
      totalProducto: datos.cantidad * datos.precio
    }))
  };
  registros.push(registro);
  localStorage.setItem("registros", JSON.stringify(registros));
  mostrarRegistros();
  mostrarGrafica();
}

function mostrarRegistros() {
  registrosLista.innerHTML = '';
  registros.forEach(registro => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${registro.fecha}</strong><br>
      Total: $${registro.total.toFixed(2)}<br>
      Productos Vendidos: <br>
      ${registro.productos.map(p => `${p.nombre}: ${p.cantidad} x $${p.totalProducto.toFixed(2)}`).join('<br>')}
    `;
    registrosLista.appendChild(li);
  });
}

function mostrarGrafica() {
  const fechas = registros.map(registro => registro.fecha);
  const totales = registros.map(registro => registro.total);

  new Chart(ventasChart, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [{
        label: "Ventas Totales",
        data: totales,
        borderColor: "#36D1DC",
        backgroundColor: "rgba(54, 209, 220, 0.2)",
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

registrarBtn.addEventListener("click", () => {
  ventas["Waka Titan"].cantidad = parseInt(document.getElementById("waka-titan").value) || 0;
  ventas["Iplay Box"].cantidad = parseInt(document.getElementById("iplay-box").value) || 0;
  ventas["Rabbeats"].cantidad = parseInt(document.getElementById("rabbeats").value) || 0;
  ventas["Tyzon"].cantidad = parseInt(document.getElementById("tyzon").value) || 0;
  ventas["PacksPod"].cantidad = parseInt(document.getElementById("packspod").value) || 0;

  actualizarTotal();
  guardarRegistros();
});

borrarRegistrosBtn.addEventListener("click", () => {
  localStorage.removeItem("registros");
  registros = [];
  mostrarRegistros();
  mostrarGrafica();
});

agregarProductoBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

cerrarModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

guardarProductoBtn.addEventListener("click", () => {
  const nombreProducto = nuevoProductoInput.value.trim();
  const precioProducto = parseFloat(precioProductoInput.value.trim());

  if (nombreProducto && !isNaN(precioProducto)) {
    ventas[nombreProducto] = { cantidad: 0, precio: precioProducto };
    nuevoProductoInput.value = "";
    precioProductoInput.value = "";
    modal.style.display = "none";
    alert("Producto agregado exitosamente");
  } else {
    alert("Por favor ingresa datos válidos");
  }
});

mostrarRegistros();
mostrarGrafica();
