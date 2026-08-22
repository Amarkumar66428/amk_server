module.exports = {
  id: "modern",

  name: "Modern Blue",

  category: "Modern",

  isFree: true,

  thumbnail: "/static/invoice-templates/modern.webp",

  defaultAppearance: {
    fontFamily: "Inter",
    fontSize: 14,
    accentColor: "#2563eb",
    textColor: "#172033",
  },

  html: `

<div class="invoice-page modern-invoice">

  <header class="invoice-header">

    <div>

      <span class="invoice-label">
        INVOICE
      </span>

      <h1>
        #{{invoiceNumber}}
      </h1>

    </div>

    <div class="invoice-date">

      <span>
        Date
      </span>

      <strong>
        {{invoiceDate}}
      </strong>

      {{#if dueDate}}

        <span>
          Due date
        </span>

        <strong>
          {{dueDate}}
        </strong>

      {{/if}}

    </div>

  </header>


  <section class="party-grid">

    <div>

      <small>
        FROM
      </small>

      <h3>
        {{sender.name}}
      </h3>

      <p>
        {{sender.address}}
      </p>

      <p>
        {{sender.email}}
      </p>

    </div>


    <div>

      <small>
        BILLED TO
      </small>

      <h3>
        {{client.name}}
      </h3>

      <p>
        {{client.address}}
      </p>

      <p>
        {{client.email}}
      </p>

    </div>

  </section>


  <table class="invoice-table">

    <thead>

      <tr>

        <th>
          Description
        </th>

        <th>
          Qty
        </th>

        <th>
          Rate
        </th>

        <th>
          Amount
        </th>

      </tr>

    </thead>

    <tbody>

      {{#each items}}

        <tr>

          <td>
            {{description}}
          </td>

          <td>
            {{quantity}}
          </td>

          <td>
            {{rateFormatted}}
          </td>

          <td>
            {{amountFormatted}}
          </td>

        </tr>

      {{/each}}

    </tbody>

  </table>


  <section class="invoice-totals">

    <div>

      <span>
        Subtotal
      </span>

      <strong>
        {{subtotalFormatted}}
      </strong>

    </div>


    {{#if taxRate}}

      <div>

        <span>
          Tax {{taxRate}}%
        </span>

        <strong>
          {{taxAmountFormatted}}
        </strong>

      </div>

    {{/if}}


    {{#if discount}}

      <div>

        <span>
          Discount
        </span>

        <strong>
          -{{discountFormatted}}
        </strong>

      </div>

    {{/if}}


    <div class="grand-total">

      <span>
        Amount Due
      </span>

      <strong>
        {{totalFormatted}}
      </strong>

    </div>

  </section>


  {{#if notes}}

    <footer>

      <strong>
        Notes
      </strong>

      <p>
        {{notes}}
      </p>

    </footer>

  {{/if}}

</div>
`,

  css: `

.modern-invoice {

  padding: 18mm;

  background: #ffffff;

  color:
    var(--invoice-text);

}

.invoice-header {

  display: flex;

  justify-content:
    space-between;

  align-items:
    flex-start;

  border-bottom:
    3px solid
    var(--invoice-accent);

  padding-bottom: 12mm;

}

.invoice-label {

  font-size: 12px;

  font-weight: 700;

  color:
    var(--invoice-accent);

  letter-spacing: 2px;

}

.invoice-header h1 {

  margin:
    5px 0 0;

  font-size: 32px;

}

.invoice-date {

  display: grid;

  text-align: right;

  gap: 4px;

}

.invoice-date span {

  color: #64748b;

  font-size: 11px;

}

.party-grid {

  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 20mm;

  margin: 15mm 0;

}

.party-grid small {

  color:
    var(--invoice-accent);

  font-weight: 700;

}

.party-grid h3 {

  margin:
    5px 0;

}

.party-grid p {

  margin:
    3px 0;

  color: #64748b;

}

.invoice-table {

  width: 100%;

}

.invoice-table th {

  padding:
    10px 8px;

  text-align: left;

  background:
    var(--invoice-accent);

  color: white;

}

.invoice-table td {

  padding:
    12px 8px;

  border-bottom:
    1px solid #e2e8f0;

}

.invoice-table th:not(:first-child),
.invoice-table td:not(:first-child) {

  text-align: right;

}

.invoice-totals {

  width: 45%;

  margin:
    15mm 0 0 auto;

}

.invoice-totals > div {

  display: flex;

  justify-content:
    space-between;

  padding:
    5px 0;

}

.grand-total {

  border-top:
    2px solid
    var(--invoice-accent);

  margin-top: 8px;

  padding-top:
    10px !important;

  font-size:
    calc(
      var(--invoice-font-size)
      + 4px
    );

}

.grand-total strong {

  color:
    var(--invoice-accent);

}

footer {

  margin-top: 20mm;

  border-top:
    1px solid #e2e8f0;

  padding-top: 8mm;

}

`,
};
