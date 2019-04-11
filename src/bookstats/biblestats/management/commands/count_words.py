import logging
import re

from collections import Counter
from django.core.management.base import NoArgsCommand
from biblestats.models import Book, Chapter, WordIndex

# Get an instance of a logger
logger = logging.getLogger(__name__)


class Command(NoArgsCommand):
    help = 'Count words'

    def count_chapter_words(self, chapter):
        words = re.findall(r'[a-zA-Z]+', chapter.content.lower())
        wordcount = Counter(words)

        for word, count in wordcount.items():
            wordindex, created = WordIndex.objects.get_or_create(word=word, chapter=chapter)
            wordindex.count = count
            wordindex.save()

    def handle_noargs(self, **options):
        logger.info("count words in a chapter..")

        try:
            logger.info("starting")

            chapters = Chapter.objects.filter(id__gt=50)

            count = 1
            total = len(chapters)
            for chapter in chapters:
                logger.info("chapter: %s (%d/%d)" % (chapter, count, total))
                self.count_chapter_words(chapter)
                count += 1

        except Exception as e:
            logger.error("- %s %s" % (type(e).__name__, e.args))
        finally:
            logger.info('finished')
