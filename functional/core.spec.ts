import 'isomorphic-fetch';
import * as fetchMock from 'fetch-mock';
import {DefaultEventResponse} from '../src/events';
import coveoua from '../src/coveoua/browser';
import {changeDocumentLocation, getParsedBody} from './utils';
describe('core functionnalities', () => {
    const initialLocation = `${window.location}`;
    const aToken = 'token';
    const anEndpoint = 'http://bloup';

    const numberFormat = /[0-9]+/;
    const guidFormat = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;

    const defaultContextValues = {
        dl: `${location.protocol}//${location.hostname}${
            location.pathname.indexOf('/') === 0 ? location.pathname : `/${location.pathname}`
        }${location.search}`,
        sr: `${screen.width}x${screen.height}`,
        sd: `${screen.colorDepth}-bit`,
        ul: navigator.language,
        ua: navigator.userAgent,
        dr: document.referrer,
        dt: document.title,
        de: document.characterSet,
        pid: expect.stringMatching(guidFormat),
        cid: expect.stringMatching(guidFormat),
        tm: expect.stringMatching(numberFormat),
        z: expect.stringMatching(guidFormat),
    };

    beforeEach(() => {
        changeDocumentLocation(initialLocation);
        const address = `${anEndpoint}/rest/v15/analytics/collect`;
        fetchMock.reset();
        fetchMock.post(address, (url, {body}) => {
            const parsedBody = JSON.parse(body.toString());
            const visitorId = parsedBody.cid;
            return {
                visitId: 'firsttimevisiting',
                visitorId,
            } as DefaultEventResponse;
        });
        coveoua('reset');
        coveoua('init', aToken, anEndpoint);
    });

    it('should convert the application identifiers using the measurement protocol keys', async () => {
        await coveoua('set', {
            appName: 'some App Name',
            appId: 'com.coveo.foo',
            appVersion: '1.2.3',
            appInstallerId: 'com.coveo.bar',
        });

        await coveoua('send', 'event');

        const [body] = getParsedBody(fetchMock);
        expect(body).toEqual({
            ...defaultContextValues,
            t: 'event',
            an: 'some App Name',
            aid: 'com.coveo.foo',
            av: '1.2.3',
            aiid: 'com.coveo.bar',
        });
    });
});
