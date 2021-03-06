import bcrypt from 'bcrypt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/User'

export default () => {
	passport.use(
		new LocalStrategy(
			{ usernameField: 'email', passwordField: 'password' },
			async (email, password, done) => {
				try {
					const user = await User.findOne({ email })
					if (!user)
						done(null, false, { message: '존재하지 않는 이메일입니다!' })
					const result = await bcrypt.compare(password, user!.password)
					if (result) return done(null, user)
					return done(null, false, { message: '비밀번호가 틀렸습니다.' })
				} catch (error) {
					console.error(error)
					return done(error)
				}
			}
		)
	)
}
