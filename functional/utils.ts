import type {FetchMockStatic} from 'fetch-mock';

export const changeDocumentLocation = (url: string) => {
    delete window.location;
    // @ts-ignore
    // Ooommmpf... JSDOM does not support any form of navigation, so let's overwrite the whole thing 💥.
    window.location = new URL(url);
};

export const getParsedBody = (fetchMock: FetchMockStatic): any[] => {
    return fetchMock.calls().map(([, {body}]) => JSON.parse(body.toString()));
};
