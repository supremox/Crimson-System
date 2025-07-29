from django.core.management.base import BaseCommand
from company.models import Stamping
from company.stamping.pdf import WriteToPdf, OR

class Command(BaseCommand):
    help = "Generate billing PDFs"

    def handle(self, *args, **kwargs):
        data =[
            {
                "headers": {
                "billed_to": "4CG CONSUMER GOODS TRADING",
                "address": "SUITE 43A 3RD FLR MIDLAND PLAZA \nM ADRIATICO ST MANILA 1000 ",
                "company_code": "null",
                "tin": "null",
                "business_style": "null",
                "voyage_no": "vessel_voyage",
                "vessel_name": "vessel",
                "invoice_date": "2025-07-24",
                "bl_number": "100510077377g",
                "loaded_at": "load_port",
                "destination": "string 2",
                "arrived_departed": "2025-06-17"
                },
                "sequence": "0000001",
                "list_of_charges": [
                {
                    "charge_code": "THCC",
                    "amount": 294,
                    "currency": "USD",
                    "exchange_rate": 51.22,
                    "amount_to_php": 15058.68
                },
                {
                    "charge_code": "IRF",
                    "amount": 550,
                    "currency": "PHP",
                    "exchange_rate": "",
                    "amount_to_php": 550
                },
                {
                    "charge_code": "DOCC",
                    "amount": 70,
                    "currency": "USD",
                    "exchange_rate": 51.22,
                    "amount_to_php": 3585.4
                },
                {
                    "charge_code": "CLNC",
                    "amount": 80,
                    "currency": "USD",
                    "exchange_rate": 51.22,
                    "amount_to_php": 4097.6
                }
                ],
                "total_per_currency": [
                "60114 USD Currency",
                "550 PHP Currency"
                ],
                "total": 23291.68
            },
            {
            "headers": {
                "billed_to": "ATLAS HOME PRODUCTS INC",
                "address": "NO 552 ELCANO STREET TONDO MANILA \nPHILIPPINES",
                "company_code": "null",
                "tin": "null",
                "business_style": "null",
                "voyage_no": "vessel_voyage",
                "vessel_name": "vessel",
                "invoice_date": "2025-07-24",
                "bl_number": "890510002430g",
                "loaded_at": "load_port",
                "destination": "string 2",
                "arrived_departed": "2025-06-17"
            },
            "sequence": "0000002",
            "list_of_charges": [
            {
                "charge_code": "THCC",
                "amount": 588,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 30117.36
            },
            {
                "charge_code": "EMCC",
                "amount": 200,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 10244
            },
            {
                "charge_code": "DOCC",
                "amount": 70,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 3585.4
            },
            {
                "charge_code": "ECRC",
                "amount": 800,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 40976
            },
            {
                "charge_code": "CLNC",
                "amount": 160,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 8195.2
            },
            {
                "charge_code": "IRF",
                "amount": 1100,
                "currency": "PHP",
                "exchange_rate": "",
                "amount_to_php": 1100
            },
            {
                "charge_code": "PSSC",
                "amount": 400,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 20488
            },
            {
                "charge_code": "EHR",
                "amount": 126,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 6453.72
            },
            {
                "charge_code": "CICC",
                "amount": 1320,
                "currency": "USD",
                "exchange_rate": 51.22,
                "amount_to_php": 67610.4
            }
            ],
            "total_per_currency": [
                "3666 USD Currency",
                "1100 PHP Currency"
            ],
            "total": 1188770.08
        }
        ]

        # stamps = [1, 2]
        for billing_invoice in data:
            filename = f"OR_{billing_invoice['sequence']}.pdf"
            with open(filename, "wb") as f:
                f.write(OR(billing_invoice))
        self.stdout.write(self.style.SUCCESS("PDFs generated!"))