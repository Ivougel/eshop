const SECRET = "CHANGE_ME";
const SHEET_NAME = "Заказы";

function headers() {
  return [
    "Номер",
    "Дата",
    "Telegram ID",
    "Username",
    "Платформа",
    "Товар",
    "Регион",
    "Сумма",
    "Статус",
  ];
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers());
    sheet.getRange(1, 1, 1, headers().length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function readBody(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function authorize(body, e) {
  const fromBody = String(body.secret || "");
  const fromQuery = e && e.parameter ? String(e.parameter.secret || "") : "";
  return Boolean(SECRET) && (fromBody === SECRET || fromQuery === SECRET);
}

function appendOrder(body) {
  const sheet = getSheet();
  const when = body.createdAt
    ? Utilities.formatDate(
        new Date(body.createdAt),
        "Europe/Moscow",
        "dd.MM.yyyy HH:mm"
      )
    : Utilities.formatDate(new Date(), "Europe/Moscow", "dd.MM.yyyy HH:mm");
  sheet.appendRow([
    Number(body.id) || "",
    when,
    Number(body.chatId) || "",
    body.username || "",
    body.platform || "",
    body.denomination || "",
    body.region || "",
    Number(body.priceRub) || 0,
    body.status || "Новый",
  ]);
}

function listOrders(chatId) {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const orders = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (Number(row[2]) !== Number(chatId)) {
      continue;
    }
    orders.push({
      id: Number(row[0]) || 0,
      createdAt: String(row[1] || ""),
      chatId: Number(row[2]) || 0,
      username: String(row[3] || ""),
      platform: String(row[4] || ""),
      denomination: String(row[5] || ""),
      region: String(row[6] || ""),
      priceRub: Number(row[7]) || 0,
      status: String(row[8] || "Новый"),
    });
  }
  return orders.reverse();
}

function doPost(e) {
  const body = readBody(e);
  if (!authorize(body, e)) {
    return json({ ok: false, error: "forbidden" });
  }
  if (body.action === "list") {
    return json({ ok: true, orders: listOrders(Number(body.chatId)) });
  }
  appendOrder(body);
  return json({ ok: true });
}

function doGet(e) {
  const body = {};
  if (!authorize(body, e)) {
    return json({ ok: false, error: "forbidden" });
  }
  if (e && e.parameter && e.parameter.action === "list") {
    return json({ ok: true, orders: listOrders(Number(e.parameter.chatId)) });
  }
  return json({ ok: true });
}
