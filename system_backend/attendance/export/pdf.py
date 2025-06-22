from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors

def WriteToPdf(data):
    buffer = BytesIO()
    pdf_canvas = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Title
    pdf_canvas.setFont("Helvetica-Bold", 16)
    title_text = "Weekly Report"
    title_width = pdf_canvas.stringWidth(title_text, "Helvetica-Bold", 16)
    title_x = (width - title_width) / 2  # Center the title horizontally
    pdf_canvas.drawString(title_x, height - 80, title_text)  # Adjust Y position for smaller gap

    # Table Data
    table_data = [["Employee ID", "Name", "Department", "Status"]]  # Headers
    for record in data:
        table_data.append([
            record.employee_id.user.employee_id,
            f"{record.employee_id.user.first_name} {record.employee_id.user.last_name}",
            record.time_in,
            record.time_out
        ])

    # Create Table
    table = Table(table_data, colWidths=[100, 150, 100, 100])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ]))

    # Calculate table position to center it
    table_width, table_height = table.wrap(0, 0)
    table_x = (width - table_width) / 2  # Center the table horizontally
    table_y = height - 120 - table_height  # Position table below the title with minimal gap

    # Add Table to PDF
    table.drawOn(pdf_canvas, table_x, table_y)

    # Finalize PDF
    pdf_canvas.save()
    pdf_data = buffer.getvalue()
    buffer.close()
    return pdf_data