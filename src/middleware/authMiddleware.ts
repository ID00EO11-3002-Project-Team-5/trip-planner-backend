import { Response, NextFunction } from 'express';
import { createUserClientFromAuthHeader } from '../lib/supabaseClients';
import { Request } from 'express';
import { SupabaseClient } from '@supabase/supabase-js';


export interface AuthRequest extends Request {
    user?: any;
    supabase?: SupabaseClient;
}


export const protect =async (req: AuthRequest, res: Response ,ext: NextFunction) => {
    const authHeader = req.headers.authorization;
    

    if (!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({error: 'Not authorized, no token provided'});
    }
    const userClient = createUserClientFromAuthHeader(authHeader);

    if (userClient === null) {
        return res.status(401).json({ error: 'Failed to initialize security context' });
    }
    
    try{
        const{ data: {user},error } = await userClient.auth.getUser(); 

        if( error || !user) {
            return res.status(401).json({error: 'toekn is invalid or exprired'});
        }

        req.user = user;
        req.supabase = userClient;

    }catch(err){
        return res.status(500).json({error: 'integral server error during authentication'})
    }
};