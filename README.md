# The Flying Dutchman - by Roaring Waves (HTML)

Group Members:
Yu-Hua Huang,
Qida Li,
Danning Nie,
Astrid Nord Olsson,
Wen-Hsuan Peng

## Viewing the project:

1.  **Navigate to the `views` Directory:**

    ```bash
    cd User_Interface_2025/webpage/views/
    ```

    (Adjust the path if the project is in a different location.)

2.  **Open an HTML File:**

    - **macOS:** `open index.html` (or `open login.html`, `open menu.html`, etc.)
    - **Linux:** `xdg-open index.html`
    - **Windows:** `start index.html`

    This will open the file in your default browser.

## Logging in:

Go to the login.html page.

**Owner:** Username: owner1, Password: 1234

**Bartender:** Username: bartender1, Password: 1234

**VIP Customer:\*** Username: vipcustomer1, Password: 1234

Click the "Login" button.

## Dependencies:

External Libraries:

- jQuery (3.6.0) - loaded via CDN

  - URL: https://code.jquery.com/jquery-3.6.0.min.js
  - Used in: menu.html, vip-info.html, vip-menu.html

- Font Awesome (6.2.0) - loaded via CDN

  - URL: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css
  - Used in: menu.html, vip-menu.html

- Google Fonts (Material Icons) - loaded via CDN
  - URL: https://fonts.googleapis.com/icon?family=Material+Icons
  - Used in: vip-info.html

## Time Report:

- **Week 1:** Feb 10 – Feb 16
  - Understand requirements
- **Week 2:** Feb 17 – Feb 23
  - Prototyping
  - Structure system
- **Week 3:** Feb 24 – Mar 2
  - Prototyping
  - Coding
- **Week 4:** Mar 3 – Mar 9
  - Applied the MVC (Model-View-Controller) structure to organize code for clearer separation of logic, presentation, and data handling.
- **Week 5:** Mar 10 – Mar 16
  - Coding
  - Implimentation
- **Week 6:** Mar 17 – Mar 23
  - Final report editing

## Individual Contribution:

- **Yu Hua Huang:** Responsible for prototyping on design part of boarding page, main page, and waiter and waitress pages, as well as styling in both `.html` and `.css` based on prototypes.
- **Qida Li:** Implemented owner page, parts of login function, first version of bartender page, undo/redo on stock management and some additional function such as the restriction of items in the shopping cart.
- **Danning Nie:** Implemented VIP data retrieval and display, code generator, extended VIP menu and payment option, maintained dictionary and database
- **Astrid Nord Olsson:** Implemented bartender page with MVC architecture, including order backend, payment popup, undo/redo functionality and styling based on prototype.
- **Wen-Hsuan Peng:** Implemented menu, cart and payment MVC logic and display, multilingual UI switching, and login/logout processing.

## File structure

```bash
.
├── README.md
├── User_Interface_2025.code-workspace
└── webpage
    ├── data
    │   ├── Beverages_eng.json
    │   ├── food_menu.json
    │   ├── orders.json
    │   ├── user.json
    │   └── vip_menu.json
    ├── public
    │   ├── css
    │   │   ├── bartender.css
    │   │   ├── login.css
    │   │   ├── menu.css
    │   │   ├── owner.css
    │   │   ├── payment.css
    │   │   ├── style.css (
    │   │   ├── vip.css
    │   │   └── vip_info.css
    │   ├── images
    │   │   ├── BG.jpg
    │   │   ├── drinks (Folder)
    │   │   ├── food  (Folder)
    │   └── js
    │       ├── bartender_controller.js
    │       ├── bartender_view.js
    │       ├── code_generator.js (generates code for VIP fridge)
    │       ├── lang.js
    │       ├── login.js
    │       ├── menu_controller.js
    │       ├── menu_model.js
    │       ├── menu_view.js
    │       ├── orders_model.js
    │       ├── owner_controller.js
    │       ├── pay_contorller.js
    │       ├── pay_view.js
    │       ├── payment.js
    │       ├── user_controller.js
    │       ├── user_model.js
    │       ├── user_view.js
    │       ├── vip_controller.js
    │       └── vip_info.js
    └── views
        ├── bartender.html
        ├── index.html
        ├── login.html
        ├── menu.html
        ├── owner.html
        ├── payment.html
        ├── vip-info.html
        ├── vip-menu.html
        └── vip-payment.html
```
