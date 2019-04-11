from django.contrib import admin
from biblestats.models import Book, Chapter, WordIndex


class BookAdmin(admin.ModelAdmin):
    list_display = ('name', 'testament', 'author', 'order')
    list_filter = ('testament', 'author', )
    list_editable = ('testament', 'author', 'order', )
    search_fields = ('name', 'author', )


class ChapterAdmin(admin.ModelAdmin):
    list_display = ('book', 'nr', )
    list_filter = ('book', )
    list_editable = ('nr', )
    search_fields = ('nr', 'book__name', )


class WordIndexAdmin(admin.ModelAdmin):
    list_display = ('word', 'chapter', 'count')
    list_filter = ('chapter__book__testament', )
    search_fields = ('word', )


admin.site.register(Book, BookAdmin)
admin.site.register(Chapter, ChapterAdmin)
admin.site.register(WordIndex, WordIndexAdmin)
