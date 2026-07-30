import os
import uuid

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.pdfgen import canvas

CERT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "certificates")
os.makedirs(CERT_DIR, exist_ok=True)


def generate_certificate(student_name: str, event_title: str, event_date: str) -> tuple[str, str]:
    """Generates a PDF certificate and returns (certificate_code, file_path)."""
    code = f"CERT-{uuid.uuid4().hex[:10].upper()}"
    filename = f"{code}.pdf"
    filepath = os.path.join(CERT_DIR, filename)

    width, height = landscape(A4)
    c = canvas.Canvas(filepath, pagesize=landscape(A4))

    # Border
    c.setStrokeColor(colors.HexColor("#6366F1"))
    c.setLineWidth(6)
    c.rect(1 * cm, 1 * cm, width - 2 * cm, height - 2 * cm)

    c.setStrokeColor(colors.HexColor("#A855F7"))
    c.setLineWidth(1.5)
    c.rect(1.4 * cm, 1.4 * cm, width - 2.8 * cm, height - 2.8 * cm)

    # Title
    c.setFillColor(colors.HexColor("#1E1B4B"))
    c.setFont("Helvetica-Bold", 34)
    c.drawCentredString(width / 2, height - 4.2 * cm, "CERTIFICATE OF PARTICIPATION")

    c.setFont("Helvetica", 14)
    c.setFillColor(colors.HexColor("#4B5563"))
    c.drawCentredString(width / 2, height - 5.4 * cm, "Smart Event Management System - College Events Portal")

    c.setFont("Helvetica", 16)
    c.drawCentredString(width / 2, height - 7.5 * cm, "This certificate is proudly presented to")

    c.setFont("Helvetica-Bold", 30)
    c.setFillColor(colors.HexColor("#6366F1"))
    c.drawCentredString(width / 2, height - 9.2 * cm, student_name)

    c.setFont("Helvetica", 16)
    c.setFillColor(colors.HexColor("#1F2937"))
    c.drawCentredString(
        width / 2,
        height - 11 * cm,
        f"for successfully participating in \"{event_title}\"",
    )
    c.drawCentredString(width / 2, height - 12.2 * cm, f"held on {event_date}")

    c.setFont("Helvetica-Oblique", 11)
    c.setFillColor(colors.HexColor("#6B7280"))
    c.drawCentredString(width / 2, 2.6 * cm, f"Certificate ID: {code}")

    c.setFont("Helvetica-Bold", 13)
    c.setFillColor(colors.HexColor("#1E1B4B"))
    c.drawString(width - 8 * cm, 3.6 * cm, "Authorized Signatory")
    c.line(width - 8 * cm, 4.1 * cm, width - 2.5 * cm, 4.1 * cm)

    c.showPage()
    c.save()

    return code, filepath
