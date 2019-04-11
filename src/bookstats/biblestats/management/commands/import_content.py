import os
import logging
import re
import glob

from django.core.management.base import NoArgsCommand
from biblestats.models import Book, Chapter, WordIndex
from django.conf import settings

# Get an instance of a logger
logger = logging.getLogger(__name__)

class Command(NoArgsCommand):
    help = 'Import content'
    
    filenames = glob.glob("%s/*.txt" % (settings.DATA_DIR / "kingjamesversion"))

    def parse_filename(self, filename):
        m = re.search("([\d]*[a-zA-Z ]+)(\d+).txt", filename)
        book = m.group(1)
        chapter = m.group(2)
        return book, chapter

    def content_in_file(self, filename):
        f = open(r"%s" % (filename), "r", encoding="utf-8-sig")
        with open(filename) as f:
            return f.read()

    def get_or_create_books_and_chapters(self, filename):
        # parse filename to get the book and chapter
        book, chapter = self.parse_filename(filename)
        logger.info("- book: %s, chapter: %s, filename: %s" % (book, chapter, filename))

        # get chapter contents from the file
        content = self.content_in_file(filename)

        # get or create books
        try:
            book_obj, created = Book.objects.get_or_create(name=book)
        except Exception as e:
            logger.error("error creating book, error: %s" % e)

        # get or create chapter
        try:
            chapter_obj, created = Chapter.objects.get_or_create(nr=chapter, book=book_obj, content=content)
        except Exception as e:
            logger.error("error creating chapter, error: %s" % e)

    def handle_noargs(self, **options):
        logger.info("import verses, chapters and books")

        try:
            logger.info("starting")

            for filename in self.filenames:

                # get or create books and chapters from filename
                self.get_or_create_books_and_chapters(filename)

                # self.words_in_file(filename)

        except Exception as e:
            logger.error("- %s %s" % (type(e).__name__, e.args))
        finally:
            logger.info('finished')
