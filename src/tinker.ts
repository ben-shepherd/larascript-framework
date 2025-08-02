/* eslint-disable no-unused-vars */
 
import 'dotenv/config';
import 'tsconfig-paths/register';

import TinkerService from '@src/core/domains/tinker/services/TinkerService';
import { app } from '@src/core/services/App';

import Mail from './core/domains/mail/data/Mail';




(async () => {

    // Boot the application
    await TinkerService.boot({
        useTestDb: false
    });

    // Useful services for debugging
    const db        = app('db');
    const events    = app('events');
    const logger    = app('logger');
    const query     = app('query');
    const validator = app('validatorFn');
    
    // Add your code here
    const driver = app('mail').resend();
    
    await driver.send(
        new Mail({
            to: 'ben.shepherd@gmx.com',
            from: 'no-reply@employmint.app',
            subject: 'This is a test',
            body: `
                <html>
                    <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
                        <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
                            <h2 style="color: #2d7d46;">Welcome to Employmint!</h2>
                            <p>Hello <b>Ben</b>,</p>
                            <p>This is a <span style="color: #2d7d46;">test email</span> sent from the <b>Larascript</b> framework.</p>
                            <p>Feel free to ignore this message. If you received this by mistake, no action is required.</p>
                            <hr style="margin: 32px 0;">
                            <small style="color: #888;">&copy; 2024 Employmint. All rights reserved.</small>
                        </div>
                    </body>
                </html>
            `
        })
    )
})(); 