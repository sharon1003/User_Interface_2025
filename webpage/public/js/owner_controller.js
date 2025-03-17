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
      let newStockValue = inputField.value;

      if (newStockValue < 0) {
          alert("Stock value cannot be negative!");
          return;
      }

      stockCount.textContent = newStockValue;
  }

  deleteStock(event) {
      this.saveState();
      let stockItem = event.target.closest(".stock-item");
      let stockCount = stockItem.querySelector(".stock-count");
      let inputField = stockItem.querySelector(".stock-input");

      stockCount.textContent = "0";
      inputField.value = "0";
  }

  undo() {
      if (this.undoStack.length > 0) {
          this.redoStack.push(this.stockList.innerHTML);
          this.stockList.innerHTML = this.undoStack.pop();
          this.rebindEventListeners();
      }
  }

  redo() {
      if (this.redoStack.length > 0) {
          this.undoStack.push(this.stockList.innerHTML);
          this.stockList.innerHTML = this.redoStack.pop();
          this.rebindEventListeners();
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
