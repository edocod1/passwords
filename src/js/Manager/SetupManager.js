import Vue from 'vue';
import Localisation from "@js/Classes/Localisation";
import SettingsService from '@js/Services/SettingsService';
import DeferredActivationService from '@js/Services/DeferredActivationService';

class SetupManager {

    /**
     * Check if wizard should be executed and run it
     *
     * @returns {Promise<void>}
     */
    async runAutomatically() {
        if(SettingsService.get('client.setup.initialized', false)) return;
        if(!await DeferredActivationService.check('first-run-wizard', true)) return;

        await this._runWizard();
    }

    /**
     * Run the entire wizard manually
     *
     * @returns {Promise<void>}
     */
    runManually() {
        return this._runWizard();
    }

    /**
     * Run the encryption setup
     *
     * @returns {Promise<void>}
     */
    runEncryptionSetup() {
        try {
            return this._runWizard(['start', 'encryption'], true, false);
        } catch(e) {
            console.error(e);
        }
    }

    /**
     * Run the wizard with the given settings
     *
     * @param enableSlides
     * @param closable
     * @param redirect
     * @returns {Promise<void>}
     * @private
     */
    _runWizard(enableSlides, closable, redirect) {
        return new Promise(async (resolve) => {
            await Localisation.loadSection('tutorial');

            let SetupDialog = await import(/* webpackChunkName: "SetupWizard" */ '@vue/Dialog/SetupDialog.vue'),
                SetupWizard = Vue.extend(SetupDialog.default);

            new SetupWizard({propsData: {enableSlides, closable, redirect, _close:resolve}}).$mount('#app-popup div');
        });
    }
}

export default new SetupManager();