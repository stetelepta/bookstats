from django.db import models


class Book(models.Model):
    TESTAMENTS = (
        ('old_testament', 'Old Testament'),
        ('new_testament', 'New Testament'),
    )

    name = models.CharField(max_length=255)
    testament = models.CharField(max_length=255, choices=TESTAMENTS, blank=True)
    author = models.CharField(max_length=255, db_index=True, blank=True, null=True)
    order = models.IntegerField(db_index=True, blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['order', ]


class Chapter(models.Model):
    book = models.ForeignKey(Book)
    nr = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return "%s %s" % (self.book, self.nr)


class WordIndex(models.Model):
    word = models.CharField(max_length=255, db_index=True)
    count = models.IntegerField(db_index=True, default=0)
    chapter = models.ForeignKey(Chapter, verbose_name="Chapter")

    def __str__(self):
        return "%s" % (self.word)
