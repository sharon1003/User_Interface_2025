class OwnerController {
  constructor() {
      this.stockList = document.getElementById("stock-list");
      this.undoStack = [];
      this.redoStack = [];

      this.init();
  }

  init() {
    this.saveState(); // Save initial state when the page loads

    document.querySelectorAll(".update-btn").forEach(button => {
        button.addEventListener("click", (event) => this.updateStock(event));
    });

    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => this.deleteStock(event));
    });

    document.getElementById("undo-button").addEventListener("click", () => this.undo());
    document.getElementById("redo-button").addEventListener("click", () => this.redo());

    this.checkLowStock(); // Initialize check for low stock
  }

  saveState() {
    if (this.undoStack.length === 0 || this.undoStack[this.undoStack.length - 1] !== this.stockList.innerHTML) {
        this.undoStack.push(this.stockList.innerHTML);
    }
    this.redoStack = []; // Clear redo stack whenever a new change is made
  } 

  updateStock(event) {
      this.saveState();
      let stockItem = event.target.closest(".stock-item");
      let inputField = stockItem.querySelector(".stock-input");
      let stockCount = stockItem.querySelector(".stock-count");
      let newStockValue = parseInt(inputField.value, 10);

      if (newStockValue < 0) {
          alert("Stock value cannot be negative!");
          return;
      }

      stockCount.textContent = newStockValue;
      this.checkLowStock();
  }

  deleteStock(event) {
      this.saveState();
      let stockItem = event.target.closest(".stock-item");
      let stockCount = stockItem.querySelector(".stock-count");
      let inputField = stockItem.querySelector(".stock-input");

      stockCount.textContent = "0";
      inputField.value = "0";

      this.checkLowStock();
  }

  checkLowStock() {
      document.querySelectorAll(".stock-item").forEach(stockItem => {
          let stockCount = parseInt(stockItem.querySelector(".stock-count").textContent, 10);
          let lowStockWarning = stockItem.querySelector(".low-stock-warning");

          if (stockCount < 5) {
              if (!lowStockWarning) {
                  let warning = document.createElement("span");
                  warning.textContent = " LOW STOCK!!! ";
                  warning.classList.add("low-stock-warning");
                  stockItem.querySelector("h3").appendChild(warning);
              }
          } else {
              if (lowStockWarning) {
                  lowStockWarning.remove();
              }
          }
      });
  }

  undo() {
      if (this.undoStack.length > 0) {
          this.redoStack.push(this.stockList.innerHTML);
          this.stockList.innerHTML = this.undoStack.pop();
          this.rebindEventListeners();
          this.checkLowStock();
      }
  }

  redo() {
      if (this.redoStack.length > 0) {
          this.undoStack.push(this.stockList.innerHTML);
          this.stockList.innerHTML = this.redoStack.pop();
          this.rebindEventListeners();
          this.checkLowStock();
      }
  }

  rebindEventListeners() {
      document.querySelectorAll(".update-btn").forEach(button => {
          button.addEventListener("click", (event) => this.updateStock(event));
      });

      document.querySelectorAll(".delete-btn").forEach(button => {
          button.addEventListener("click", (event) => this.deleteStock(event));
      });
  }
}

// Initialize controller when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new OwnerController();
});
