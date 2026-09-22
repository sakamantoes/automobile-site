/**
 * Opens the user's mail client with a prefilled order email.
 */
export const orderByEmail = ({ item, kind = 'car' }) => {
  const admin = 'lordgroup.limited@gmail.com';
  const lines = [];

  if (kind === 'car') {
    lines.push(`Vehicle: ${item.name} (${item.year || ''})`);
    lines.push(`Make / Model: ${item.make || ''} ${item.model || ''}`.trim());
    lines.push(`Color: ${item.color || '—'}`);
    lines.push(`Transmission: ${item.transmission || '—'}`);
    lines.push(`Fuel: ${item.fuel || '—'}`);
    lines.push(`Mileage: ${item.mileage ? item.mileage.toLocaleString() + ' mi' : '—'}`);
    lines.push(`Price: ${item.price || 'Contact for price'}`);
    lines.push(`Location: ${item.location || '—'}`);
  } else {
    lines.push(`Part: ${item.name}`);
    lines.push(`Brand: ${item.brand || '—'}`);
    lines.push(`Category: ${item.category || '—'}`);
  }

  const subject = encodeURIComponent(
    `Order Request — ${item.name}`
  );
  const body = encodeURIComponent(
    `Hello Lord Group Autos,\n\nI would like to place an order for:\n\n${lines.join('\n')}\n\n` +
    `Please contact me with payment and delivery details.\n\nThank you.`
  );

  window.location.href = `mailto:${admin}?subject=${subject}&body=${body}`;
};