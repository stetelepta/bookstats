from django.db.models import Sum
from django.shortcuts import render
from biblestats.models import WordIndex, Chapter


def biblestats(request):
    return render(request, "biblestats.html", {})


def bible_csv(request):
    index = WordIndex.objects.filter(word__iexact=request.GET.get('word', 'love'))
    total = index.aggregate(Sum('count')).get('count__sum')
    return render(request, "data/bible.csv", {'index': index, 'total': total})


def chapters_csv(request):
    chapters = Chapter.objects.all().order_by('book__order', 'nr')
    return render(request, "data/chapters.csv", {'chapters': chapters})
