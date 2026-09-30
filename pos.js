/**
 * AURA LUXE — POS System (Catalog, Cart, Payments, Receipt)
 */

class POSManager {
    constructor() {
        this.cart = [];
        this.currentCategory = "all";
        this.searchQuery = "";
        this.discountAmount = 0;
        this.selectedPaymentMethod = "promptpay";
        this.currentCustomer = "ลูกค้าทั่วไป (Walk-in)";
        this.products = [];

        this.init();
    }

    async init() {
        await this.loadProducts();
        this.renderCatalog();
        this.renderCart();
        this.bindEvents();
    }

    async loadProducts() {
        this.products = await window.DB.getProducts();
    }

    bindEvents() {
        // Category pills
        document.querySelectorAll(".cat-pill").forEach(pill => {
            pill.addEventListener("click", (e) => {
                document.querySelectorAll(".cat-pill").forEach(p => p.classList.remove("active"));
                pill.classList.add("active");
                this.currentCategory = pill.getAttribute("data-category");
                this.renderCatalog();
            });
        });

        // Search input
        const searchInput = document.getElementById("pos-search-input");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.renderCatalog();
            });
        }

        // Payment methods
        document.querySelectorAll(".pm-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".pm-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                this.selectedPaymentMethod = btn.getAttribute("data-method");
            });
        });

        // Customer select
        const customerSelect = document.getElementById("pos-customer-select");
        if (customerSelect) {
            customerSelect.addEventListener("change", (e) => {
                this.currentCustomer = e.target.value;
            });
        }

        // Discount input
        const discountInput = document.getElementById("pos-discount-input");
        if (discountInput) {
            discountInput.addEventListener("input", (e) => {
                const val = parseFloat(e.target.value) || 0;
                this.discountAmount = Math.max(0, val);
                this.renderCart();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById("btn-checkout");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", () => this.handleCheckout());
        }

        // Clear cart button
        const clearCartBtn = document.getElementById("btn-clear-cart");
        if (clearCartBtn) {
            clearCartBtn.addEventListener("click", () => this.clearCart());
        }
    }

    renderCatalog() {
        const grid = document.getElementById("pos-products-grid");
        if (!grid) return;

        const filtered = this.products.filter(p => {
            const matchCat = this.currentCategory === "all" || p.category === this.currentCategory;
            const matchSearch = !this.searchQuery ||
                p.name.toLowerCase().includes(this.searchQuery) ||
                (p.description && p.description.toLowerCase().includes(this.searchQuery));
            return matchCat && matchSearch;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <div style="font-size: 2rem; margin-bottom: 8px;">🔍</div>
          <div>ไม่พบรายการสินค้าหรือบริการที่ค้นหา</div>
        </div>
      `;
            return;
        }

        grid.innerHTML = filtered.map(item => {
            const catName = {
                service: "บริการสปา & ให้คำปรึกษา",
                package: "แพ็กเกจคุ้มพิเศษ",
                makeup: "เครื่องสำอางตามโทน",
                apparel: "เครื่องแต่งกาย & เครื่องประดับ"
            }[item.category] || "ทั่วไป";

            return `
        <div class="product-card" onclick="window.POS.addToCart('${item.id}')">
          <div class="product-cat-tag">${catName}</div>
          <div class="product-name">${item.name}</div>
          <div class="product-desc">${item.description || ''}</div>
          <div class="product-bottom">
            <div class="product-price">${APP_CONFIG.currencySymbol}${item.price.toLocaleString()}</div>
            <button class="btn-add-cart" title="เพิ่มลงตะกร้า" onclick="event.stopPropagation(); window.POS.addToCart('${item.id}')">
              +
            </button>
          </div>
        </div>
      `;
        }).join("");
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existing = this.cart.find(item => item.id === productId);
        if (existing) {
            existing.qty += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                qty: 1
            });
        }

        this.renderCart();
        window.APP.showToast(`เพิ่ม "${product.name}" ลงในตะกร้าแล้ว`, "success");
    }

    updateQty(productId, change) {
        const item = this.cart.find(i => i.id === productId);
        if (!item) return;

        item.qty += change;
        if (item.qty <= 0) {
            this.cart = this.cart.filter(i => i.id !== productId);
        }

        this.renderCart();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(i => i.id !== productId);
        this.renderCart();
    }

    clearCart() {
        if (this.cart.length === 0) return;
        this.cart = [];
        this.discountAmount = 0;
        const discountInput = document.getElementById("pos-discount-input");
        if (discountInput) discountInput.value = "";
        this.renderCart();
        window.APP.showToast("ล้างรายการในตะกร้าแล้ว", "info");
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const discount = Math.min(subtotal, this.discountAmount);
        const taxableAmount = Math.max(0, subtotal - discount);
        const vat = Math.round(taxableAmount * APP_CONFIG.vatRate);
        const total = taxableAmount + vat;

        return { subtotal, discount, vat, total };
    }

    renderCart() {
        const itemsList = document.getElementById("cart-items-list");
        const countBadge = document.getElementById("cart-count-badge");
        const subtotalEl = document.getElementById("cart-subtotal");
        const discountEl = document.getElementById("cart-discount");
        const vatEl = document.getElementById("cart-vat");
        const totalEl = document.getElementById("cart-total");
        const checkoutBtn = document.getElementById("btn-checkout");

        const totalQty = this.cart.reduce((sum, item) => sum + item.qty, 0);
        if (countBadge) countBadge.textContent = totalQty;

        const { subtotal, discount, vat, total } = this.calculateTotals();

        if (subtotalEl) subtotalEl.textContent = `${APP_CONFIG.currencySymbol}${subtotal.toLocaleString()}`;
        if (discountEl) discountEl.textContent = `-${APP_CONFIG.currencySymbol}${discount.toLocaleString()}`;
        if (vatEl) vatEl.textContent = `${APP_CONFIG.currencySymbol}${vat.toLocaleString()}`;
        if (totalEl) totalEl.textContent = `${APP_CONFIG.currencySymbol}${total.toLocaleString()}`;

        if (checkoutBtn) {
            checkoutBtn.disabled = this.cart.length === 0;
            checkoutBtn.innerHTML = `ชำระเงิน (${APP_CONFIG.currencySymbol}${total.toLocaleString()})`;
        }

        if (!itemsList) return;

        if (this.cart.length === 0) {
            itemsList.innerHTML = `
        <div class="cart-empty-state">
          <div style="font-size: 2.2rem; opacity: 0.5; margin-bottom: 6px;">🛒</div>
          <div>ยังไม่มีรายการสินค้าในตะกร้า</div>
          <div style="font-size: 0.78rem; margin-top: 4px;">เลือกบริการหรือสินค้าจากรายการทางซ้าย</div>
        </div>
      `;
            return;
        }

        itemsList.innerHTML = this.cart.map(item => `
      <div class="cart-item-row">
        <div class="cart-item-info">
          <div class="cart-item-name" title="${item.name}">${item.name}</div>
          <div class="cart-item-unit-price">${APP_CONFIG.currencySymbol}${item.price.toLocaleString()} x ${item.qty}</div>
        </div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="window.POS.updateQty('${item.id}', -1)">-</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="window.POS.updateQty('${item.id}', 1)">+</button>
        </div>
        <div class="cart-item-subtotal">${APP_CONFIG.currencySymbol}${(item.price * item.qty).toLocaleString()}</div>
        <button class="btn-remove-item" onclick="window.POS.removeFromCart('${item.id}')" title="ลบรายการ">✕</button>
      </div>
    `).join("");
    }

    async handleCheckout() {
        if (this.cart.length === 0) {
            window.APP.showToast("กรุณาเลือกสินค้าลงตะกร้าก่อนชำระเงิน", "warning");
            return;
        }

        const { subtotal, discount, vat, total } = this.calculateTotals();
        const orderData = {
            customerName: this.currentCustomer,
            cashierName: window.AUTH.currentUser?.name || "Admin Staff",
            subtotal,
            discount,
            vat,
            total,
            paymentMethod: this.selectedPaymentMethod,
            items: [...this.cart]
        };

        const newOrder = await window.DB.createOrder(orderData);
        this.showReceiptModal(newOrder);
        this.cart = [];
        this.discountAmount = 0;
        const discountInput = document.getElementById("pos-discount-input");
        if (discountInput) discountInput.value = "";
        this.renderCart();

        // Trigger dashboard refresh if open
        if (window.DASHBOARD) window.DASHBOARD.refresh();
    }

    showReceiptModal(order) {
        const modalBody = document.getElementById("receipt-modal-content");
        if (!modalBody) return;

        const pmNames = {
            promptpay: "พร้อมเพย์ QR Code",
            cash: "เงินสด (Cash)",
            credit_card: "บัตรเครดิต / เดบิต",
            transfer: "โอนผ่านบัญชีธนาคาร"
        };

        // Check if customer has personal color
        let customerColorInfo = "";
        if (window.ADMIN_STUDIO?.profiles) {
            const p = window.ADMIN_STUDIO.profiles.find(x => order.customerName.includes(x.fullName || x.name));
            if (p && p.personalColor) {
                customerColorInfo = `<div><strong>Personal Color ประจำตัว:</strong> <span style="background: #fce7f3; color: #be185d; padding: 1px 6px; border-radius: 4px; font-weight: bold;">${p.personalColor} 🌸</span></div>`;
            }
        }

        modalBody.innerHTML = `
      <div class="receipt-wrapper" id="printable-receipt">
        <div class="receipt-header">
          <h2>${APP_CONFIG.appName}</h2>
          <p style="font-size: 0.85rem; color: #475569;">${APP_CONFIG.appSubtitle}</p>
          <p style="font-size: 0.75rem; color: #64748b; margin-top: 4px;">โทร: 02-999-8888 | เลขผู้เสียภาษี: 0105567890123</p>
          <p style="font-size: 0.8rem; margin-top: 8px; font-weight: bold;">ใบเสร็จรับเงิน / ใบกำกับภาษีอย่างย่อ</p>
          <div style="font-size: 0.78rem; text-align: left; margin-top: 10px; line-height: 1.4;">
            <div><strong>เลขที่:</strong> ${order.orderNo}</div>
            <div><strong>วันที่:</strong> ${new Date(order.createdAt).toLocaleString('th-TH')}</div>
            <div><strong>ลูกค้า:</strong> ${order.customerName}</div>
            ${customerColorInfo}
            <div><strong>พนักงาน:</strong> ${order.cashierName}</div>
            <div><strong>การชำระ:</strong> ${pmNames[order.paymentMethod] || order.paymentMethod}</div>
          </div>
        </div>

        <table class="receipt-items-table">
          <thead>
            <tr>
              <th>รายการ</th>
              <th style="text-align: center;">จำนวน</th>
              <th style="text-align: right;">รวม</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td style="text-align: center;">${item.qty}</td>
                <td style="text-align: right;">${APP_CONFIG.currencySymbol}${(item.price * item.qty).toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="receipt-totals">
          <div style="display: flex; justify-content: space-between;">
            <span>ยอดรวมสินค้า (Subtotal):</span>
            <span>${APP_CONFIG.currencySymbol}${order.subtotal.toLocaleString()}</span>
          </div>
          ${order.discount > 0 ? `
            <div style="display: flex; justify-content: space-between; color: #ef4444;">
              <span>ส่วนลด (Discount):</span>
              <span>-${APP_CONFIG.currencySymbol}${order.discount.toLocaleString()}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between;">
            <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
            <span>${APP_CONFIG.currencySymbol}${order.vat.toLocaleString()}</span>
          </div>
          <div class="grand-total" style="display: flex; justify-content: space-between;">
            <span>ยอดสุทธิ (Total):</span>
            <span>${APP_CONFIG.currencySymbol}${order.total.toLocaleString()}</span>
          </div>
        </div>

        <div class="receipt-qr-area">
          <div class="receipt-qr-placeholder">
            <div style="text-align: center;">
              <div style="font-size: 2rem;">📱</div>
              <div style="font-size: 0.75rem; font-weight: bold; margin-top: 4px;">PromptPay QR</div>
              <div style="font-size: 0.65rem;">สแกนเพื่อยืนยันชำระเงิน</div>
            </div>
          </div>
          <p style="font-size: 0.75rem; color: #64748b;">ขอบพระคุณที่ไว้วางใจให้ AURA LUXE ดูแลภาพลักษณ์ของคุณ</p>
        </div>
      </div>
    `;

        window.APP.openModal("receipt-modal");
    }

    printReceipt() {
        window.print();
    }
}

window.POS = new POSManager();
