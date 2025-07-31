from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from company.models import Stamping
import qrcode
from PIL import Image

def WriteToPdf(data):
    buffer = BytesIO()
    pdf_canvas = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # === Draw Logo ===
    try:
        logo_path = "company/stamping/images/ts-logo.png"  
        logo = ImageReader(logo_path)
        pdf_canvas.drawImage(logo, 300, height - 50, width=30, height=30,  preserveAspectRatio=True, mask='auto')
    except Exception as e:
        print("Logo not found or failed to load:", e)

    # === Header Section ===
    pdf_canvas.setFont("Helvetica-Bold", 12)
    pdf_canvas.drawString(220, height - 65, "TS CONTAINER LINES PTE. LTD")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(245, height - 80, "VAT REG. TIN: 669-078-083-000000")
    pdf_canvas.drawString(130, height - 93, "C/O TSL CONTAINER LINES PHILIPPINES, INC. - Unit 1103, 11/F Tower B, Two E-Com Center Building,")
    pdf_canvas.drawString(135, height - 105, "Bayshore Avenue Mall of Asia Complex, Barangay 76 1300 Pasay City NCR, Fourth District Philippines")
    pdf_canvas.drawString(257, height - 118, "Telephone: (632) 8659-5535")

    # === Billing Invoice Title and Number ===
    pdf_canvas.setFont("Helvetica-Bold", 14)
    pdf_canvas.drawString(260, height - 155, "BILLING INVOICE")
    pdf_canvas.setFont("Helvetica-Bold", 12)
    pdf_canvas.setFillColor(colors.red)
    pdf_canvas.drawRightString(width - 40, height - 155, f"No. {data["sequence"]}")
    pdf_canvas.setFillColor(colors.black)

    # === As Agent Section ===
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(43, height - 148, "As Agent:")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(43, height - 162, "TSL CONTAINER LINES PHILIPPINES INC.")

    # === Main Rectangle Box (Content Area) ===
    top_box_y = height - 160
    main_rect_x = 40
    main_rect_y = 120
    main_rect_width = width - 80
    main_rect_height = top_box_y - 130
    pdf_canvas.rect(main_rect_x, main_rect_y, main_rect_width, main_rect_height)

    # === Stamps ===
    # stamp_objs = Stamping.objects.filter(id__in=stamps)
    # for stamp in stamp_objs:
    #     try:
    #         img = ImageReader(stamp.stamping_image.path)
    #         if stamp.id == 1:
    #             # Center of main rectangle
    #             img_width = 250
    #             img_height = 250
    #             center_x = main_rect_x + (main_rect_width - img_width) / 2
    #             center_y = main_rect_y + (main_rect_height - img_height) / 2

    #             # Set opacity to 70%
    #             pdf_canvas.saveState()
    #             if hasattr(pdf_canvas, "setFillAlpha"):
    #                 pdf_canvas.setFillAlpha(0.7)
    #             else:
    #                 # For older ReportLab, setFillAlpha may not exist
    #                 pass
    #             pdf_canvas.drawImage(img, center_x, center_y, width=img_width, height=img_height, mask='auto')
    #             pdf_canvas.restoreState()
    #         else:
    #             # Example: place other stamps at fixed positions, full opacity
    #             pdf_canvas.drawImage(img, main_rect_x + 20, main_rect_y + 10, width=140, height=60, mask='auto')
    #     except Exception as e:
    #         print(f"Failed to load stamp {stamp}: {e}")

    # === Header Content ===
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(400, height - 190, "DOCUMENT NO.")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(485, height - 190, "PBI#00232900")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(400, height - 200, "INVOICE CONTROL")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(485, height - 200, "P25-029504")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(400, height - 210, "EXCHANGE RATE")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(485, height - 210, "57.4500")

    # === Client Content ===
    # pdf_canvas.setFont("Helvetica-Bold", 8)
    # pdf_canvas.drawString(50, height - 230, "BANK REFERENCE:")
    # pdf_canvas.setFont("Helvetica", 8)
    # pdf_canvas.drawString(135, height - 230, "A3ADADADA3AD3A3DADD")

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 230, "BILLED TO:")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(135, height - 230, data["headers"]["billed_to"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 243, "ADDRESS:")
    pdf_canvas.setFont("Helvetica", 8) 
    address = data["headers"]["address"]
    address_lines = address.split('\n')
    y = height - 243
    for line in address_lines:
        pdf_canvas.drawString(135, y, line)
        y -= 12 

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 270, "CUSTOMER CODE:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(135, height - 270, data["headers"]["company_code"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 281, "TIN:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(135, height - 281, data["headers"]["tin"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 294, "BUSINESS STYLE:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(135, height - 294, data["headers"]["business_style"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(380, height - 230, "INVOICE DATE:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(447, height - 230, data["headers"]["invoice_date"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(380, height - 243, "BL NUMBER:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(447, height - 243, data["headers"]["bl_number"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(380, height - 256, "VOYAGE NO:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(447, height - 256, data["headers"]["voyage_no"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(380, height - 269, "VESSEL NAME:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(447, height - 269, data["headers"]["vessel_name"])

  

    # pdf_canvas.setFont("Helvetica-Bold", 8)
    # pdf_canvas.drawString(380, height - 282, "LOADED AT:")
    # pdf_canvas.setFont("Helvetica", 8) 
    # pdf_canvas.drawString(447, height - 282, data["headers"]["loaded_at"])

    # pdf_canvas.setFont("Helvetica-Bold", 8)
    # pdf_canvas.drawString(380, height - 295, "DESTINATION:")
    # pdf_canvas.setFont("Helvetica", 8) 
    # pdf_canvas.drawString(447, height - 295, data["headers"]["destination"])

    # pdf_canvas.setFont("Helvetica-Bold", 8)
    # pdf_canvas.drawString(380, height - 308, "ARRIVED/DEPARTED:")
    # pdf_canvas.setFont("Helvetica", 8) 
    # pdf_canvas.drawString(470, height - 308, data["headers"]["arrived_departed"])

    # === TITLE FOR CHARGES ===
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(60, height - 330, "CODE")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(130, height - 330, "CHARGE DESCRIPTION")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(300, height - 330, "AMOUNT")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(360, height - 330, "EXCHANGE RATE")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(450, height - 330, "AMOUNT TO PHP")

    y = height - 350
    for charges in data["list_of_charges"]:
        pdf_canvas.setFont("Helvetica", 8)
        pdf_canvas.drawString(60, y, str(charges["charge_code"]))
        pdf_canvas.drawString(130, y, "DUMMMYY CHARGEE")
        pdf_canvas.drawString(300, y, f"{charges['amount']} {charges['currency']}")
        pdf_canvas.drawString(375, y, str(charges["exchange_rate"]))
        pdf_canvas.drawString(460, y, str(charges["amount_to_php"]))
        y -= 13  # Move down for the next charge

    vat = ["NON-VAT", "VATABLE SALES", "ZERO RATED SALE", "VAT-EXEMPT SALE", "VAT 12%", "SUB TOTAL AMOUNT:"]
    y2 = height - 550
    for label in vat:
        pdf_canvas.setFont("Helvetica-Bold", 8)
        pdf_canvas.drawString(385, y2, label)
        if label == "SUB TOTAL AMOUNT:":
            pdf_canvas.setFont("Helvetica", 8)
            pdf_canvas.drawString(490, y2, str(data["total"]))
        y2 -= 13

    pdf_canvas.setFont("Helvetica-Bold", 10)
    pdf_canvas.drawString(385, height - 640, "Total Amount:")
    pdf_canvas.drawString(490, height - 640, str(data["total"]))
    # === Totals  ===
    w = 60
    for total in data["total_per_currency"]:
        pdf_canvas.setFont("Helvetica", 8)
        pdf_canvas.drawString(w, height - 610, total)
        w += 120

    pdf_canvas.drawString(100, height - 640, "MARJORIE VELEZ")
   



    # === Footer Rounded Rectangle Box ===
    footer_x = 40
    footer_y = 50
    footer_width = width - 80
    footer_height = 65
    corner_radius = 12  # Adjust as needed

    pdf_canvas.roundRect(
        footer_x,
        footer_y,
        footer_width,
        footer_height,
        corner_radius,
        stroke=1,
        fill=0  # Set to 1 to fill with color if needed
    )

    # === Footer Left Notes ===
    pdf_canvas.setFont("Helvetica", 6.5)
    pdf_canvas.drawString(100, 95, "Over-the-counter payments must be made in cash or")
    pdf_canvas.drawString(113, 85, "Manager’s/Cashier’s Check payable to")
    pdf_canvas.setFont("Helvetica-Bold", 7)
    pdf_canvas.drawString(100, 74, "TSL CONTAINER LINES PHILIPPINES, INC.")

    # Generate and draw QR code
    # qr_value = "P25-029504"
    # qr_img = qrcode.make(qr_value)
    # qr_buffer = BytesIO()
    # qr_img.save(qr_buffer, format='PNG')
    # qr_buffer.seek(0)
    # qr_reader = ImageReader(qr_buffer)
    # pdf_canvas.drawImage(qr_reader, width - 330, height - 740, width=60, height=60)

    # === Footer Right - Bank Details ===
    pdf_canvas.setFont("Helvetica-Bold", 6.5)
    pdf_canvas.drawString(width - 250, 105, "BANK DETAILS:")
    pdf_canvas.setFont("Helvetica", 6.5)
    pdf_canvas.drawString(width - 250, 95, "1.) FOR FREIGHT, LOCAL & OTHER CHARGES:")
    pdf_canvas.drawString(width - 240, 85, "METROPOLITAN BANK & TRUST COMPANY")
    pdf_canvas.drawString(width - 240, 75, "(MET MOA/EDSA-Taft, Bay Area, Roxas Blvd., Pasay City Branch)")
    pdf_canvas.drawString(width - 240, 65, "SWIFT CODE: MBTCPHMM")
    pdf_canvas.drawString(width - 240, 55, "A/C NO (PHP): 764-7-7640007411")

    # === Finalize PDF ===
    pdf_canvas.save()
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data

# ======================================== OR PDF ==============================================================

def OR(data):
    buffer = BytesIO()
    pdf_canvas = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # === Draw Logo ===
    try:
        logo_path = "company/stamping/images/ts-logo.png"  
        logo = ImageReader(logo_path)
        pdf_canvas.drawImage(logo, 300, height - 50, width=30, height=30,  preserveAspectRatio=True, mask='auto')
    except Exception as e:
        print("Logo not found or failed to load:", e)

    # === Header Section ===
    pdf_canvas.setFont("Helvetica-Bold", 12)
    pdf_canvas.drawString(220, height - 65, "TS CONTAINER LINES PTE. LTD")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(245, height - 80, "VAT REG. TIN: 669-078-083-000000")
    pdf_canvas.drawString(130, height - 93, "C/O TSL CONTAINER LINES PHILIPPINES, INC. - Unit 1103, 11/F Tower B, Two E-Com Center Building,")
    pdf_canvas.drawString(135, height - 105, "Bayshore Avenue Mall of Asia Complex, Barangay 76 1300 Pasay City NCR, Fourth District Philippines")
    pdf_canvas.drawString(257, height - 118, "Telephone: (632) 8659-5535")

    # === OR Title and Number ===
    pdf_canvas.setFont("Helvetica-Bold", 14)
    pdf_canvas.drawString(260, height - 155, "OFFICIAL RECEIPT")
    pdf_canvas.setFont("Helvetica-Bold", 12) 
    pdf_canvas.setFillColor(colors.red)
    pdf_canvas.drawRightString(width - 40, height - 155, f"No. {data["sequence"]}")
    pdf_canvas.setFillColor(colors.black)

    # === As Agent Section ===
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(43, height - 148, "As Agent:")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(43, height - 162, "TSL CONTAINER LINES PHILIPPINES INC.")

    # === Main Rectangle Box (Content Area) ===
    top_box_y = height - 160
    main_rect_x = 40
    main_rect_y = 120
    main_rect_width = width - 80
    main_rect_height = top_box_y - 130
    pdf_canvas.rect(main_rect_x, main_rect_y, main_rect_width, main_rect_height)

   
    # === Header Content ===
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(400, height - 190, "DOCUMENT NO.")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(485, height - 190, "OR#00232900")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(400, height - 200, "OR CONTROL")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(485, height - 200, "P25-029504")
    pdf_canvas.setFont("Helvetica-Bold", 8)

    # === Client Content ===
    # pdf_canvas.setFont("Helvetica-Bold", 8)
    # pdf_canvas.drawString(50, height - 230, "BANK REFERENCE:")
    # pdf_canvas.setFont("Helvetica", 8)
    # pdf_canvas.drawString(135, height - 230, "A3ADADADA3AD3A3DADD")

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 230, "RECEIVED FROM:")
    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(135, height - 230, data["headers"]["billed_to"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 243, "ADDRESS:")
    pdf_canvas.setFont("Helvetica", 8) 
    address = data["headers"]["address"]
    address_lines = address.split('\n')
    y = height - 243
    for line in address_lines:
        pdf_canvas.drawString(135, y, line)
        y -= 12 

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 270, "TIN:")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(135, height - 270, data["headers"]["tin"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 281, "BUSINESS STYLE::")
    pdf_canvas.setFont("Helvetica", 8) 
    pdf_canvas.drawString(135, height - 281, data["headers"]["business_style"])

    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(50, height - 294, "RECEIVED THE SUM OF:")
    
    pdf_canvas.setFont("Helvetica", 8) 
    words = number_to_words(data["total"]).upper()
    value_x = 50 + 100
    max_width = main_rect_width - (value_x - main_rect_x)
    

    # ========== WORD SUM =========================
    lines = split_text_to_lines(pdf_canvas, words, "Helvetica", 8, max_width)

    y = height - 294
    for line in lines:
        pdf_canvas.drawString(value_x, y, line)
        y -= 12

    pdf_canvas.drawString(150, y, f"In PARTIAL/FULL PAYMENT OF PBI#0026581C (North) Freight/ Local Charge")

    y -= 20
    # === TITLE FOR CHARGES ===
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(60, y, "MODE OF PAYMENT")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(160, y, "PESO")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(235, y, "DOLLAR")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(300, y, "DESCRIPTION")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(370, y, "CURR AMOUNT")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(450, y, "CURR")
    pdf_canvas.setFont("Helvetica-Bold", 8)
    pdf_canvas.drawString(490, y, "LOCAL AMOUNT")

    mop = ["Cash", "Check", "Check Number", "Bank Details"]

    y -= 13

    pdf_canvas.setFont("Helvetica", 8)
    pdf_canvas.drawString(160, y, str(data["total"]))

    y_charges = y
    for charges in data["list_of_charges"]:
        pdf_canvas.setFont("Helvetica", 8)
        pdf_canvas.drawString(300, y_charges, str(charges["charge_code"]))
        pdf_canvas.drawString(370, y_charges, f"{charges['amount']} {charges['currency']}")
        pdf_canvas.drawString(450, y_charges, str(charges["currency"]))
        pdf_canvas.drawString(490, y_charges, str(charges["amount_to_php"]))
        y_charges -= 13  # Move down for the next charge

    for label in mop:
        pdf_canvas.setFont("Helvetica-Bold", 8)
        pdf_canvas.drawString(60, y, label)
        y -= 13

    excess = ["Over Payment", "Under Payment", "Bank/Service Charge"]
    y3 = height - 410
    for label in excess:
        pdf_canvas.setFont("Helvetica-Bold", 8)
        pdf_canvas.drawString(60, y3, label)
        y3 -= 13

    
    vat = ["NON-VAT", "VATABLE SALES", "ZERO RATED SALE", "VAT-EXEMPT SALE", "VAT 12%", "SUB TOTAL AMOUNT:"]
    y2 = height - 550
    for label in vat:
        pdf_canvas.setFont("Helvetica-Bold", 8)
        pdf_canvas.drawString(385, y2, label)
        if label == "SUB TOTAL AMOUNT:":
            pdf_canvas.setFont("Helvetica", 8)
            pdf_canvas.drawString(490, y2, str(data["total"]))
        y2 -= 13

    pdf_canvas.setFont("Helvetica-Bold", 10)
    pdf_canvas.drawString(385, height - 640, "Total Amount:")
    pdf_canvas.drawString(490, height - 640, str(data["total"]))

    pdf_canvas.drawString(100, height - 640, "MARJORIE VELEZ")
   
    # === Finalize PDF ===
    pdf_canvas.save()
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data

def split_text_to_lines(pdf_canvas, text, font_name, font_size, max_width):
    words_split = text.split()
    lines = []
    current_line = ""
    for word in words_split:
        test_line = f"{current_line} {word}".strip()
        if pdf_canvas.stringWidth(test_line, font_name, font_size) <= max_width:
            current_line = test_line
        else:
            if current_line:  # Only append if not empty
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)
    return lines

def within_10(amount: int):
    match amount:
        case 1:
            return "one"
        
        case 2:
            return "two"
        
        case 3:
            return "three"
        
        case 4:
            return "four"
        
        case 5:
            return "five"
        
        case 6:
            return "six"
        
        case 7:
            return "seven"
        
        case 8:
            return "eight"
        
        case 9:
            return "nine"
        
        case _:
            return ""

def within_100(amount: int):
    if 90 <= amount:
        remain = amount - 90
        if remain:
            return f"ninety {within_10(remain)}"
        
        return "ninety"

    elif 80 <= amount:
        remain = amount - 80
        if remain:
            return f"eighty {within_10(remain)}"
        
        return "eighty"
    
    elif 70 <= amount:
        remain = amount - 70
        if remain:
            return f"seventy {within_10(remain)}"
        
        return "seventy"
    
    elif 60 <= amount:
        remain = amount - 60
        if remain:
            return f"sixty {within_10(remain)}"
        
        return "sixty"
    
    elif 50 <= amount:
        remain = amount - 50
        if remain:
            return f"fifty {within_10(remain)}"
        
        return "fifty"
    
    elif 40 <= amount:
        remain = amount - 40
        if remain:
            return f"forty {within_10(remain)}"
        
        return "forty"
    
    elif 30 <= amount:
        remain = amount - 30
        if remain:
            return f"thirty {within_10(remain)}"
        
        return "thirty"
    
    elif 20 <= amount:
        remain = amount - 20
        if remain:
            return f"twenty {within_10(remain)}"
        
        return "twenty"
    
    elif 10 <= amount:
        if amount == 19:
            return "nineteen"
        
        elif amount == 18:
            return "eighteen"
        
        elif amount == 17:
            return "seventeen"
        
        elif amount == 16:
            return "sixteen"
        
        elif amount == 15:
            return "fifteen"
        
        elif amount == 14:
            return "fourteen"
        
        elif amount == 13:
            return "thirteen"
        
        elif amount == 12:
            return "twelve"
        
        elif amount == 11:
            return "eleven"
        
        elif amount == 10:
            return "ten"

    else:
        return within_10(amount)

def within_1000(amount: int):
    t, re = divmod(amount, 100)
    tho = within_10(t)
    hun = within_100(re)
    word = ""
    
    if tho:
        word = f"{word} {tho} hundred"
    
    if hun:
        word = f"{word} {hun}"
    
    return word.strip()


def get_cent_word(amount: float):
    amount = amount * 100
    return f"{within_100(amount)} cents"

def number_to_words(a: float):
    is_negative = False
    if a == 0:
        return "zero"
    
    if a < 0:
        is_negative = True
        a = -1 * a
    
    # cents
    a, cents = divmod(a, 1)
    cent_words = None
    if cents:
        cent_words = get_cent_word(round(cents, 2))

    billion = 10 ** 9
    million = 10 ** 6
    thousand = 10 ** 3

    words = ""
    if billion <= a:
        bil, a = divmod(a, billion)
        bil = int(bil)
        words = f"{words} {within_100(bil)} billion"

    if million <= a:
        bil, a = divmod(a, million)
        bil = int(bil)
        words = f"{words} {within_1000(bil)} million"

    if thousand <= a:
        bil, a = divmod(a, thousand)
        bil = int(bil)
        words = f"{words} {within_1000(bil)} thousand"

    if a != 0 or words:
        words = f"{words} {within_1000(a)} pesos"
        
    if cent_words:
        if words:
            words = f"{words} and {cent_words}"

        else:
            words = cent_words

    words = words.strip().replace("  ", " ")

    if is_negative:
        return f"negative {words} only"    

    return f"{words} only"