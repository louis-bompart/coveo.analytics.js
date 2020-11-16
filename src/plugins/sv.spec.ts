import {SV, SVPluginEventTypes} from './sv';
import {createAnalyticsClientMock} from '../../tests/analyticsClientMock';

describe('SV plugin', () => {
    let sv: SV;
    let client: ReturnType<typeof createAnalyticsClientMock>;

    const someUUIDGenerator = jest.fn(() => someUUID);
    const someUUID = '13ccebdb-0138-45e8-bf70-884817ead190';
    const defaultResult = {
        pageViewId: someUUID,
        encoding: document.characterSet,
        location: 'http://localhost/',
        referrer: 'http://somewhere.over/therainbow',
        title: 'MAH PAGE',
        screenColor: '24-bit',
        screenResolution: '0x0',
        time: expect.any(String),
        userAgent: navigator.userAgent,
        language: 'en-US',
        hitType: SVPluginEventTypes.event,
        eventId: someUUID,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        client = createAnalyticsClientMock();
        sv = new SV({client, uuidGenerator: someUUIDGenerator});
    });

    it('should register a hook in the client', () => {
        expect(client.registerBeforeSendEventHook).toHaveBeenCalledTimes(1);
    });

    it('should register a mapping for each SV type', () => {
        expect(client.addEventTypeMapping).toHaveBeenCalledTimes(Object.keys(SVPluginEventTypes).length);
    });

    describe('tickets', () => {
        it('should set the ticket provisional id when initTicket is called', () => {
            sv.initTicket();

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});
            expect(result).toEqual({...defaultResult, ticketProvisionalId: '13ccebdb-0138-45e8-bf70-884817ead190'});
        });

        it('should set the ticket with the specific format when the hook is called', () => {
            sv.setTicket({subject: 'Some Subject'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({...defaultResult, ticketSubject: 'Some Subject'});
        });

        it('should append the ticket with the pageview event', () => {
            sv.setTicket({subject: 'Some Subject'});

            const result = executeRegisteredHook(SVPluginEventTypes.pageview, {});

            expect(result).toEqual({...defaultResult, hitType: SVPluginEventTypes.pageview, ticketSubject: 'Some Subject'});
        });

        it('should not append the product with a random event type', () => {
            sv.setTicket({subject: 'Some Subject'});

            const result = executeRegisteredHook('🎲', {});

            expect(result).toEqual({});
        });

        it('should keep the ticket until a valid event type is used', () => {
            sv.setTicket({subject: 'Some Subject'});

            executeRegisteredHook('🎲', {});
            executeRegisteredHook('🐟', {});
            executeRegisteredHook('💀', {});
            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({...defaultResult, ticketSubject: 'Some Subject'});
        });

        it('should convert known ticket keys into the measurement protocol format', () => {
            sv.setTicket({
                id: 'TKABC',
                subject: '🧀',
                description: 'description',
                category: 'category',
                productId: 'PR123',
            });

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({
                ...defaultResult,
                ticketId: 'TKABC',
                ticketSubject: '🧀',
                ticketDescription: 'description',
                ticketCategory: 'category',
                ticketProductId: 'PR123',
            });
        });

        it('should keep custom metadata in the ticket', () => {
            sv.setTicket({subject: '🧀', custom: {verycustom: 'value'}});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({...defaultResult, ticketSubject: '🧀', ticketCustom: {verycustom: 'value'}});
        });

        it('should flush the ticket once they are sent', () => {
            sv.setTicket({subject: '🍟', description: 'description'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).not.toEqual({});

            const secondResult = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(secondResult).toEqual({...defaultResult});
        });
    });

    describe('impressions', () => {
        it('should append the impression with the specific format when the hook is called', () => {
            sv.addImpression({id: 'C0V30'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({...defaultResult, il1ii1id: 'C0V30'});
        });

        it('should append the impression with the pageview event', () => {
            sv.addImpression({name: 'Relevance T-Shirt'});

            const result = executeRegisteredHook(SVPluginEventTypes.pageview, {});

            expect(result).toEqual({
                ...defaultResult,
                hitType: SVPluginEventTypes.pageview,
                il1ii1nm: 'Relevance T-Shirt',
            });
        });

        it('should not append the impression with a random event type', () => {
            sv.addImpression({id: ':sorandom:'});

            const result = executeRegisteredHook('🎲', {});

            expect(result).toEqual({});
        });

        it('should keep the impressions until a valid event type is used', () => {
            sv.addImpression({id: 'P12345'});

            executeRegisteredHook('🎲', {});
            executeRegisteredHook('🐟', {});
            executeRegisteredHook('💀', {});
            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({...defaultResult, il1ii1id: 'P12345'});
        });

        it('should convert known impression keys into the measurement protocol format', () => {
            sv.addImpression({name: '🧀', id: 'someid', list: 'somelist'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({
                ...defaultResult,
                il1ii1nm: '🧀',
                il1ii1id: 'someid',
                il1nm: 'somelist',
            });
        });

        it('should keep custom metadata in the impression', () => {
            sv.addImpression({name: '🧀', custom: {verycustom: 'value'}});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({
                ...defaultResult,
                il1ii1nm: '🧀',
                il1ii1custom: {verycustom: 'value'},
            });
        });

        it('should allow adding multiple impressions', () => {
            sv.addImpression({name: '🍟'});
            sv.addImpression({name: '🍿'});
            sv.addImpression({name: '🥤'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({
                ...defaultResult,
                il1ii1nm: '🍟',
                il1ii2nm: '🍿',
                il1ii3nm: '🥤',
            });
        });

        it('should allow adding impressions from multiple lists', () => {
            sv.addImpression({list: 'food', name: '🍟'});
            sv.addImpression({list: 'food', name: '🍿'});
            sv.addImpression({list: 'drinks', name: '🥤'});
            sv.addImpression({list: 'drinks', name: '🧃'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).toEqual({
                ...defaultResult,
                il1nm: 'food',
                il1ii1nm: '🍟',
                il1ii2nm: '🍿',
                il2nm: 'drinks',
                il2ii1nm: '🥤',
                il2ii2nm: '🧃',
            });
        });

        it('should flush the impressions once they are sent', () => {
            sv.addImpression({name: '🍟'});
            sv.addImpression({name: '🍿'});

            const result = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(result).not.toEqual({});

            const secondResult = executeRegisteredHook(SVPluginEventTypes.event, {});

            expect(secondResult).toEqual({...defaultResult});
        });

        describe('when the position is invalid', () => {
            it('should warn when executing hook on added impression', () => {
                jest.spyOn(console, 'warn').mockImplementation();

                const anImpression = {
                    name: 'An impression with a too small position',
                    position: 0,
                };

                sv.addImpression(anImpression);

                expect(console.warn).not.toHaveBeenCalled();

                executeRegisteredHook(SVPluginEventTypes.event, {});

                expect(console.warn).toHaveBeenCalledWith(
                    `The position for impression '${anImpression.name}' must be greater than 0 when provided.`
                );
                expect(console.warn).toHaveBeenCalledTimes(1);
            });

            it('should remove the position when executing hook on added impression', () => {
                jest.spyOn(console, 'warn').mockImplementation();

                sv.addImpression({
                    name: 'An impression with a too small position',
                    position: 0,
                });

                const result = executeRegisteredHook(SVPluginEventTypes.event, {});

                const positionProperty = 'il1ii1ps';
                expect(result).not.toHaveProperty(positionProperty);
            });

            it('should warn first using the impression name then the id', () => {
                jest.spyOn(console, 'warn').mockImplementation();

                const anImpressionWithANameAndId = {
                    name: 'An impression with a name and id',
                    id: 'An id',
                    position: 0,
                };
                const anImpressionWithOnlyAnId = {
                    id: 'An id',
                    position: 0,
                };

                sv.addImpression(anImpressionWithANameAndId);
                sv.addImpression(anImpressionWithOnlyAnId);

                executeRegisteredHook(SVPluginEventTypes.event, {});

                expect(console.warn).toHaveBeenNthCalledWith(
                    1,
                    `The position for impression '${anImpressionWithANameAndId.name}' must be greater than 0 when provided.`
                );
                expect(console.warn).toHaveBeenNthCalledWith(
                    2,
                    `The position for impression '${anImpressionWithOnlyAnId.id}' must be greater than 0 when provided.`
                );
            });

            it('should tolerate an absent position', () => {
                jest.spyOn(console, 'warn').mockImplementation();

                sv.addImpression({
                    name: 'An impression with no position',
                });

                const undefinedPosition = undefined as any;
                sv.addImpression({
                    name: 'An impression with an undefined position',
                    position: undefinedPosition,
                });

                const result = executeRegisteredHook(SVPluginEventTypes.event, {});

                expect(console.warn).not.toHaveBeenCalled();

                const firstPositionProperty = 'il1ii1ps';
                expect(result).not.toHaveProperty(firstPositionProperty);

                const secondPositionProperty = 'il1ii2ps';
                expect(result).toHaveProperty(secondPositionProperty, undefinedPosition);
            });
        });
    });

    it('should be able to set an action', () => {
        sv.setAction('ok');

        const result = executeRegisteredHook(SVPluginEventTypes.event, {});

        expect(result).toEqual({
            ...defaultResult,
            action: 'ok',
        });
    });

    it('should flush the action once it is sent', () => {
        sv.setAction('ok');

        const result = executeRegisteredHook(SVPluginEventTypes.event, {});

        expect(result).not.toEqual({});

        const secondResult = executeRegisteredHook(SVPluginEventTypes.event, {});

        expect(secondResult).toEqual({...defaultResult});
    });

    it('should be able to clear all the data', () => {
        sv.setTicket({subject: '🍨', description: 'Some desc'});
        sv.addImpression({id: '🍦', name: 'impression'});
        sv.clearData();

        const result = executeRegisteredHook(SVPluginEventTypes.event, {});

        expect(result).toEqual({...defaultResult});
    });

    it('should convert known EC keys to the measurement protocol format in the hook', () => {
        const payload = {
            clientId: '1234',
            encoding: 'en-GB',
            action: 'bloup',
        };

        const result = executeRegisteredHook(SVPluginEventTypes.event, payload);

        expect(result).toEqual({
            ...defaultResult,
            clientId: payload.clientId,
            encoding: payload.encoding,
            action: payload.action,
        });
    });

    it('should call the uuidv4 method', async () => {
        await executeRegisteredHook(SVPluginEventTypes.event, {});
        await executeRegisteredHook(SVPluginEventTypes.event, {});
        await executeRegisteredHook(SVPluginEventTypes.event, {});

        // One for generating pageViewId, one for each individual event.
        expect(someUUIDGenerator).toHaveBeenCalledTimes(1 + 3);
    });

    it('should update the location when sending a pageview with the page parameter', async () => {
        const payload = {
            page: '/somepage',
        };

        const pageview = await executeRegisteredHook(SVPluginEventTypes.pageview, payload);
        const event = await executeRegisteredHook(SVPluginEventTypes.event, {});

        expect(pageview).toEqual({
            ...defaultResult,
            hitType: SVPluginEventTypes.pageview,
            page: payload.page,
            location: `${defaultResult.location}${payload.page.substring(1)}`,
        });
        expect(event).toEqual({
            ...defaultResult,
            hitType: SVPluginEventTypes.event,
            location: `${defaultResult.location}${payload.page.substring(1)}`,
        });
    });

    const executeRegisteredHook = (eventType: string, payload: any) => {
        const [hook] = client.registerBeforeSendEventHook.mock.calls[0];
        return hook(eventType, payload);
    };
});
