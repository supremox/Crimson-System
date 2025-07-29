from django.db import models
from mptt.models import MPTTModel, TreeForeignKey

# Create your models here.
class Company(MPTTModel):
    company_code = models.CharField(max_length=6, unique=True)
    company_name = models.CharField(max_length=255)
    date_created = models.DateTimeField(auto_now_add=True)
    is_super_company = models.BooleanField(default=False)
    parent = TreeForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )

    class MPTTMeta:
        order_insertion_by = ['company_name']

    def save(self, *args, **kwargs):
        if self.is_super_company:
            # Set all others to False before saving
            Company.objects.filter(is_super_company=True).update(is_super_company=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.company_name
    

class Stamping(models.Model):
    stamping_image = models.ImageField(upload_to='stamping_images/')

    def __str__(self):
        return str(self.stamping_image)
    
class DocumentProcessing(models.Model):
    document = models.FilePathField()

    