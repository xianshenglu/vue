import { browser, $$ } from 'protractor';
import { waitForListRendered } from './common/index';
import { AppPage } from './app.po';

describe('rank-list', () => {
  let page: AppPage;
  const dataListFinders = $$('[test-id="page-rank-list"] [test-class="list"]');
  beforeEach(async (done) => {
    page = new AppPage();
    await page.navigateToRankList();
    await waitForListRendered(dataListFinders);

    done();
  });
  // todo fix
  // it('should navigate to rank/info after click >', async () => {
  //   const firstListItemLink = dataListFinders.get(0).$('[test-class="link"]');
  //   // firstListItemLink only available before DOM change
  //   const targetHref = await firstListItemLink.getAttribute('href');
  //   await firstListItemLink.click();
  //   expect(await browser.getCurrentUrl()).toContain(targetHref);
  // });

  afterAll(() => {
    page.returnHome();
  });
});
