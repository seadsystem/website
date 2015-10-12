# from django.test import TestCase
# to run this just type: python tests.py
# say you are on the test branch:
# Test push for Aiden

# steps to take when you are making any GOOD changes:

# git add .
# git commit -m "what I added..."
# git push origin tests //only push if it is in a working state

# git checkout master
# git pull origin master

# to avoid local copy of master to be broken:
# git checkout tests
# git merge master (as long as your master is up to date)
# git add .
# git commit -m "a message of what i added..."

# git checkout master
# git merge tests
# <<<< now your master and your tests are the most up to date
# git push origin master

# Create your tests here.

__author__ = 'jason'
'''
Quick demo of selenium used for scraping data from a Los Angeles real estate listing
'''

import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
#from selenium.webdriver.common.by import By
#from selenium.webdriver.support.ui import WebDriverWait
"""
class SeadsTesting(unittest.TestCase):
	def setUp(self):
		self.browser = webdriver.Firefox()
"""

browser = webdriver.Firefox()
browser.get("http:/google.com/")
assert "Google" in browser.title
elem = browser.find_element_by_name("q")  # Finds the search box
elem.send_keys("blahblah")     #types into the query
elem.send_keys(Keys.RETURN)
browser.close()



"""
def setup(params):
    browser = webdriver.Firefox()
    browser.get('http://google.com/')
    assert 'Google' in browser.title
    browser = enter_search_terms(browser, params)
    return browser


def enter_search_terms(browser, params):
    #elem = browser.find_element_by_name('ctl00$MainContent$SmartSearch1$txtSearchBox')  # Finds the search box
    #elem.send_keys(str(params) + Keys.RETURN)
    return browser

def get_class(browser, class_id):
    #titles = WebDriverWait(browser, 10).until(EC.presence_of_all_elements_located((By.CLASS_NAME, str(class_id))))
    return titles

#def print_list(items):
    #for item in items:
     #   print item.text + "\n"

def search(params):
    browser = setup(params)
    #results = get_class(browser, 'MyFavoritesAmenitiesContainer')
    try:
        print_list(results)
    except StaleElementReferenceException as e:
        browser.quit()
        search(params)
    else:
        browser.quit()

search(90064)
"""

"""
class PollsViewsTestCase(TestCase):
    def test_index(self):
        resp = self.client.get('/polls/')
        self.assertEqual(resp.status_code, 200)
        self.assertTrue('latest_poll_list' in resp.context)
        self.assertEqual([poll.pk for poll in resp.context['latest_poll_list']], [1])
"""
