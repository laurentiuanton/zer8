"use server"

import { createClient } from "@/lib/supabase/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const COURIER_NAMES: Record<string, string> = {
  fan_courier: "Fan Courier",
  sameday: "Sameday",
  cargus: "Cargus",
  gls: "GLS Romania",
  dpd: "DPD Romania",
}

interface OrderItem {
  name: string
  size?: string
  color?: string
  quantity: number
  price: number
}

interface OrderData {
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  currency: string
  courier: string
  paymentMethod: string
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    county: string
    postalCode: string
  }
  locale: string
}

function buildConfirmationEmail(orderId: string, data: OrderData, locale: string) {
  const courierName = COURIER_NAMES[data.courier] || data.courier
  const paymentLabel =
    data.paymentMethod === "ramburs"
      ? locale === "ro"
        ? "Ramburs (la curier)"
        : "Cash on Delivery"
      : locale === "ro"
        ? "Card bancar"
        : "Card Payment"

  const items = data.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:12px 0;border-bottom:1px solid #444;color:#ccc;font-family:monospace;">
            ${item.name}${item.size ? ` (${item.size}` : ""}${item.color ? ` / ${item.color}` : ""}${item.size ? ")" : ""}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #444;text-align:center;color:#ccc;font-family:monospace;">
            x${item.quantity}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #444;text-align:right;color:#0FED19;font-family:monospace;font-weight:bold;">
            ${(item.price * item.quantity).toFixed(2)} ${data.currency}
          </td>
        </tr>`
    )
    .join("")

  const freeShippingLabel = locale === "ro" ? "Gratuit" : "Free"

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#222;font-family:'JetBrains Mono',monospace;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;padding:32px 0;border-bottom:2px solid #0FED19;">
      <h1 style="margin:0;font-size:32px;color:#0FED19;letter-spacing:4px;text-shadow:0 0 10px rgba(15,237,25,0.5);">ZER8</h1>
      <p style="margin:8px 0 0;color:#888;font-size:12px;letter-spacing:2px;">
        ${locale === "ro" ? "CONFIRMARE COMANDA" : "ORDER CONFIRMATION"}
      </p>
    </div>

    <div style="padding:24px 0;text-align:center;">
      <p style="margin:0;color:#888;font-size:12px;letter-spacing:1px;">
        ${locale === "ro" ? "NUMAR COMANDA" : "ORDER NUMBER"}
      </p>
      <p style="margin:8px 0 0;color:#0FED19;font-size:18px;font-weight:bold;letter-spacing:2px;">
        #${orderId.slice(0, 8).toUpperCase()}
      </p>
    </div>

    <div style="padding:16px 0;">
      <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6;">
        ${locale === "ro" ? `Salut ${data.shippingAddress.firstName},` : `Hi ${data.shippingAddress.firstName},`}
      </p>
      <p style="margin:12px 0 0;color:#ccc;font-size:14px;line-height:1.6;">
        ${locale === "ro"
          ? "Comanda ta a fost inregistrata cu succes. O vom procesa in cel mai scurt timp."
          : "Your order has been placed successfully. We'll process it as soon as possible."}
      </p>
    </div>

    <div style="padding:24px 0;">
      <h2 style="margin:0 0 16px;color:#0FED19;font-size:14px;letter-spacing:2px;border-bottom:1px solid #444;padding-bottom:8px;">
        ${locale === "ro" ? "PRODUSE" : "ITEMS"}
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr>
            <th style="padding:8px 0;text-align:left;color:#888;font-size:11px;letter-spacing:1px;border-bottom:1px solid #555;">
              ${locale === "ro" ? "PRODUS" : "PRODUCT"}
            </th>
            <th style="padding:8px 0;text-align:center;color:#888;font-size:11px;letter-spacing:1px;border-bottom:1px solid #555;">
              ${locale === "ro" ? "CANT." : "QTY"}
            </th>
            <th style="padding:8px 0;text-align:right;color:#888;font-size:11px;letter-spacing:1px;border-bottom:1px solid #555;">
              PRET
            </th>
          </tr>
        </thead>
        <tbody>${items}</tbody>
      </table>
    </div>

    <div style="padding:0 0 24px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;color:#ccc;font-size:13px;font-family:monospace;">
        <span>${locale === "ro" ? "Subtotal" : "Subtotal"}</span>
        <span>${data.subtotal.toFixed(2)} ${data.currency}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;color:#ccc;font-size:13px;font-family:monospace;">
        <span>${locale === "ro" ? "Transport" : "Shipping"} (${courierName})</span>
        <span>${data.shipping === 0 ? freeShippingLabel : `${data.shipping.toFixed(2)} ${data.currency}`}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;color:#ccc;font-size:13px;font-family:monospace;">
        <span>${locale === "ro" ? "Plata" : "Payment"}</span>
        <span>${paymentLabel}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:12px 0;border-top:2px solid #0FED19;margin-top:8px;">
        <span style="color:#fff;font-size:16px;font-weight:bold;font-family:monospace;">
          ${locale === "ro" ? "TOTAL" : "TOTAL"}
        </span>
        <span style="color:#0FED19;font-size:16px;font-weight:bold;font-family:monospace;text-shadow:0 0 8px rgba(15,237,25,0.4);">
          ${data.total.toFixed(2)} ${data.currency}
        </span>
      </div>
    </div>

    <div style="padding:24px 0;border-top:1px solid #444;">
      <h2 style="margin:0 0 12px;color:#0FED19;font-size:14px;letter-spacing:2px;">
        ${locale === "ro" ? "LIVRARE" : "DELIVERY"}
      </h2>
      <table style="width:100%;font-family:monospace;font-size:13px;color:#ccc;border:1px solid #444;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #444;color:#888;width:40%;">
            ${locale === "ro" ? "Curier" : "Courier"}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #444;font-weight:bold;">${courierName}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #444;color:#888;">
            ${locale === "ro" ? "Adresa" : "Address"}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #444;">
            ${data.shippingAddress.firstName} ${data.shippingAddress.lastName}<br>
            ${data.shippingAddress.address}<br>
            ${data.shippingAddress.postalCode} ${data.shippingAddress.city}, ${data.shippingAddress.county}
          </td>
        </tr>
        <tr>
          <td style="padding:10px 12px;color:#888;">
            ${locale === "ro" ? "Telefon" : "Phone"}
          </td>
          <td style="padding:10px 12px;">${data.shippingAddress.phone}</td>
        </tr>
      </table>
    </div>

    ${data.paymentMethod === "ramburs" ? `
    <div style="padding:16px 0;">
      <div style="background:rgba(237,0,212,0.1);border:1px solid rgba(237,0,212,0.3);border-radius:8px;padding:16px;text-align:center;">
        <p style="margin:0;color:#ED00D4;font-size:13px;font-family:monospace;">
          ${locale === "ro"
            ? "Plata se efectueaza numerar la curier in momentul livrarii."
            : "Payment is made in cash to the courier upon delivery."}
        </p>
      </div>
    </div>
    ` : ""}

    <div style="padding:32px 0;border-top:1px solid #444;text-align:center;">
      <p style="margin:0;color:#888;font-size:11px;line-height:1.8;">
        ${locale === "ro"
          ? "Daca ai intrebari despre comanda, raspunde la acest email."
          : "If you have questions about your order, reply to this email."}
      </p>
      <p style="margin:16px 0 0;color:#555;font-size:10px;letter-spacing:2px;">
        ZER8 &copy; ${new Date().getFullYear()} &mdash; ${locale === "ro" ? "Toate drepturile rezervate" : "All rights reserved"}
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function placeOrder(data: OrderData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      subtotal: data.subtotal,
      shipping_cost: data.shipping,
      tax: 0,
      total: data.total,
      currency: data.currency,
      shipping_address: {
        full_name: `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
        phone: data.shippingAddress.phone,
        address_line1: data.shippingAddress.address,
        city: data.shippingAddress.city,
        state: data.shippingAddress.county,
        postal_code: data.shippingAddress.postalCode,
        country: "Romania",
      },
      payment_method: data.paymentMethod,
      notes: `Courier: ${data.courier}`,
    })
    .select("id")
    .single()

  if (orderError || !order) {
    return { error: orderError?.message || "Failed to create order" }
  }

  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_name: item.name,
    variant_name: [item.size, item.color].filter(Boolean).join(" / "),
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    return { error: itemsError.message }
  }

  if (process.env.RESEND_API_KEY) {
    try {
      await resend.emails.send({
        from: "ZER8 <noreply@zer8.ro>",
        to: data.shippingAddress.email,
        subject:
          data.locale === "ro"
            ? `ZER8 — Comanda #${order.id.slice(0, 8).toUpperCase()} confirmata`
            : `ZER8 — Order #${order.id.slice(0, 8).toUpperCase()} confirmed`,
        html: buildConfirmationEmail(order.id, data, data.locale),
      })
    } catch {
      // Email failed but order was placed
    }
  }

  return { success: true, orderId: order.id }
}
