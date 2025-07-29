from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

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


